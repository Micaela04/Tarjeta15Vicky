/**
 * ═══════════════════════════════════════════════════════════════
 * MIS 15 CAMILA - Google Apps Script Backend
 * 
 * Maneja dos acciones:
 *   1. RSVP: Guarda confirmaciones de asistencia en Google Sheets
 *   2. UPLOAD: Recibe fotos en Base64 y las guarda en Google Drive
 * 
 * INSTRUCCIONES DE CONFIGURACIÓN:
 *   1. Abrí https://script.google.com y creá un nuevo proyecto
 *   2. Pegá este código en el editor (reemplazando todo el contenido)
 *   3. Completá las 3 constantes de abajo con tus IDs
 *   4. Guardá (Ctrl+S)
 *   5. Hacé Deploy > Nueva implementación > Tipo: App web
 *      - Ejecutar como: Yo
 *      - Quién tiene acceso: Cualquier persona
 *   6. Copiá la URL del deploy y pegala en script.js (CONFIG.APPS_SCRIPT_URL)
 * ═══════════════════════════════════════════════════════════════
 */

// ══════════════════════════════════════════════════════════════
// ★ CONFIGURACIÓN - Completá con tus datos
// ══════════════════════════════════════════════════════════════

/**
 * ID del Google Spreadsheet donde se guardan las confirmaciones.
 * Lo encontrás en la URL de tu Sheet:
 * https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit
 */
const SPREADSHEET_ID = '1_829ZkK1OsFgirpORSFef5dpKVESGj1FzXDc6aw2Qss';

/**
 * Nombre de la hoja (pestaña) dentro del Spreadsheet.
 * Por defecto usa "Confirmaciones". Creá una hoja con ese nombre
 * o cambiá el valor a uno que ya exista.
 */
const SHEET_NAME = 'Confirmaciones';

/**
 * ID de la carpeta de Google Drive donde se guardan las fotos.
 * Lo encontrás en la URL de la carpeta:
 * https://drive.google.com/drive/folders/[ESTE_ES_EL_ID]
 */
const DRIVE_FOLDER_ID = '1-riUiur5YrX5JULcoQVaCXX7tJqkw-ck';


// ══════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL: doPost(e)
// Recibe todos los POST del frontend y los enruta según la acción
// ══════════════════════════════════════════════════════════════

function doPost(e) {
  try {
    // Parsear el body del POST
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    
    var result;
    
    switch (action) {
      case 'rsvp':
        result = handleRSVP(payload);
        break;
      case 'upload':
        result = handleUpload(payload);
        break;
      default:
        result = { success: false, error: 'Acción no reconocida: ' + action };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error en doPost: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


// ══════════════════════════════════════════════════════════════
// doGet(e) - Health check / verificación de que el deploy está OK
// ══════════════════════════════════════════════════════════════

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'MIS 15 CAMILA - Backend activo',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}


// ══════════════════════════════════════════════════════════════
// ACCIÓN 1: RSVP → Google Sheets
// ══════════════════════════════════════════════════════════════

/**
 * Recibe los datos del formulario de confirmación y los agrega
 * como una nueva fila en el Google Sheet.
 * 
 * Columnas: Timestamp | Nombre | Cantidad | Teléfono | Asistencia | Restricciones
 * Columnas: Nombre | Apellido | Teléfono | Cantidad | Confirmación | Requerimiento de alimentación | Mensaje | Fecha
 * 
 * @param {Object} payload - Datos del formulario
 * @returns {Object} Resultado de la operación
 */
function handleRSVP(payload) {
  try {
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Si la hoja no existe, crearla con encabezados
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Nombre',
        'Apellido',
        'Teléfono',
        'Cantidad',
        'Confirmación',
        'Requerimiento de alimentación',
        'Mensaje',
        'Fecha'
      ]);
      
      // Dar formato a los encabezados
      var headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#c2a990');
      headerRange.setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
    
    // Agregar nueva fila con los datos
    var timestamp = new Date().toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires'
    });
    
    sheet.appendRow([
      payload.nombre || '',
      payload.apellido || '',
      payload.telefono || '',
      payload.cantidad || '1',
      payload.asistencia === 'si' ? 'SI' : 'NO',
      payload.restricciones || '',
      payload.mensaje || '',
      timestamp
    ]);
    
    Logger.log('RSVP guardado: ' + payload.nombre + ' - ' + payload.asistencia);
    
    return {
      success: true,
      message: 'Confirmación guardada correctamente'
    };
    
  } catch (error) {
    Logger.log('Error en handleRSVP: ' + error.toString());
    return {
      success: false,
      error: 'Error al guardar confirmación: ' + error.toString()
    };
  }
}


// ══════════════════════════════════════════════════════════════
// ACCIÓN 2: UPLOAD → Google Drive
// ══════════════════════════════════════════════════════════════

/**
 * Recibe una imagen en formato Base64, la decodifica y la guarda
 * como archivo en la carpeta de Google Drive especificada.
 * 
 * @param {Object} payload - Contiene fileName, mimeType y data (base64)
 * @returns {Object} Resultado de la operación con el ID del archivo
 */
function handleUpload(payload) {
  try {
    var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    
    // Decodificar Base64 a Blob
    var decodedData = Utilities.base64Decode(payload.data);
    var blob = Utilities.newBlob(decodedData, payload.mimeType, payload.fileName);
    
    // Crear el archivo en Drive
    var file = folder.createFile(blob);
    
    // Agregar timestamp al nombre para evitar duplicados
    var timestamp = Utilities.formatDate(
      new Date(), 
      'America/Argentina/Buenos_Aires', 
      'yyyyMMdd_HHmmss'
    );
    file.setName(timestamp + '_' + payload.fileName);
    
    Logger.log('Archivo subido: ' + file.getName() + ' (ID: ' + file.getId() + ')');
    
    return {
      success: true,
      message: 'Archivo subido correctamente',
      fileId: file.getId(),
      fileName: file.getName()
    };
    
  } catch (error) {
    Logger.log('Error en handleUpload: ' + error.toString());
    return {
      success: false,
      error: 'Error al subir archivo: ' + error.toString()
    };
  }
}


// ══════════════════════════════════════════════════════════════
// UTILIDAD: Setup inicial (ejecutar manualmente una sola vez)
// ══════════════════════════════════════════════════════════════

/**
 * Función de utilidad para verificar que la configuración es correcta.
 * Ejecutala manualmente desde el editor de Apps Script para probar.
 */
function testSetup() {
  Logger.log('=== TEST DE CONFIGURACIÓN ===');
  
  // Test Sheet
  try {
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log('✓ Spreadsheet encontrado: ' + spreadsheet.getName());
    
    var sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (sheet) {
      Logger.log('✓ Hoja "' + SHEET_NAME + '" encontrada');
    } else {
      Logger.log('⚠ Hoja "' + SHEET_NAME + '" no existe (se creará automáticamente)');
    }
  } catch (e) {
    Logger.log('✗ Error con Spreadsheet: ' + e.toString());
  }
  
  // Test Drive Folder
  try {
    var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    Logger.log('✓ Carpeta de Drive encontrada: ' + folder.getName());
  } catch (e) {
    Logger.log('✗ Error con carpeta de Drive: ' + e.toString());
  }
  
  Logger.log('=== FIN DEL TEST ===');
}
