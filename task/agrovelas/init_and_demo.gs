/**
 * AGROVELAS - Inicializar Base de Datos + Datos Demo
 * Pegar este script completo en Extensiones > Apps Script
 * Ejecutar: 1) inicializarBaseDeDatos 2) poblarDatosDemo
 */

function inicializarBaseDeDatos() {
  const SHEETS = [
    'Animales', 'Registro_Fenotipico', 'Registro_Genotipico', 'Reproduccion',
    'Sanidad', 'Animales_Alerta', 'Ubicacion_Manejo', 'Lotes_Cabanas',
    'Esquila', 'Contabilidad', 'Usuarios', 'Zootecnistas',
    'Citas_Zootecnista', 'Calendario_Actividades', 'Notificaciones',
    'Multimedia', 'IoT_Dispositivos', 'IoT_Lecturas',
    'Listas', 'Secuencias', 'Logs_Sistema', 'Config_Sistema'
  ];

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  SHEETS.forEach(name => {
    const existing = ss.getSheetByName(name);
    if (existing) ss.deleteSheet(existing);
    ss.insertSheet(name);
  });

  const HEADERS = {
    Usuarios: ['id_usuario','nombre_completo','correo','usuario_login','contrasena_hash','sal','rol','telefono','foto_perfil_url','estado','fecha_creacion','ultimo_acceso','intentos_fallidos'],
    Zootecnistas: ['id_zootecnista','id_usuario','especialidad','anios_experiencia','calificacion_promedio','numero_calificaciones','tarifa_consulta','zona_cobertura','telefono_contacto','correo_contacto','biografia','foto_url','horario_disponible_json','estado'],
    Animales: ['id_animal','codigo_arete_rfid','nombre','especie','raza','sexo','fecha_nacimiento','edad_actual','color_principal','id_padre','id_madre','linea_genetica','procedencia','id_lote_cabana','estado','fecha_registro','registrado_por','codigo_qr_url','foto_principal_url','observaciones_generales'],
    Registro_Fenotipico: ['id_fenotipico','id_animal','fecha_evaluacion','peso_kg','altura_cruz_cm','longitud_corporal_cm','perimetro_toracico_cm','condicion_corporal','tipo_fibra','color_fibra','marcas_distintivas','evaluado_por','observaciones'],
    Registro_Genotipico: ['id_genotipico','id_animal','categoria_registro','pureza_genetica_pct','finura_fibra_um','categoria_fibra','densidad_vellon','uniformidad_vellon','certificado_genealogico_url','antecedentes_geneticos','enfermedades_hereditarias_conocidas','fecha_registro','observaciones'],
    Reproduccion: ['id_reproduccion','id_animal_hembra','tipo_evento','fecha_evento','id_macho','metodo','resultado','fecha_probable_parto','numero_crias','id_cria','responsable','observaciones'],
    Sanidad: ['id_sanidad','id_animal','fecha','tipo_evento','nombre_producto','dosis','via_aplicacion','diagnostico','sintomas_observados','veterinario_responsable','proxima_fecha_aplicacion','costo','estado','observaciones'],
    Animales_Alerta: ['id_alerta','id_animal','fecha_reporte','reportado_por','sintomas','nivel_urgencia','zootecnista_asignado','veterinario_asignado','estado','diagnostico_final','id_sanidad_relacionado','fecha_resolucion'],
    Ubicacion_Manejo: ['id_movimiento','id_animal','fecha','tipo_movimiento','id_lote_origen','id_lote_destino','latitud','longitud','responsable','motivo','observaciones'],
    Lotes_Cabanas: ['id_lote','nombre_lote','tipo_animal_predominante','capacidad_maxima','animales_actuales','ubicacion_descripcion','latitud_centro','longitud_centro','responsable','estado'],
    Esquila: ['id_esquila','id_animal','fecha_esquila','peso_vellon_kg','categoria_fibra','micronaje_um','longitud_mecha_cm','color_fibra','destino','comprador','precio_por_kg','ingreso_total','responsable','observaciones'],
    Contabilidad: ['id_movimiento_contable','fecha','tipo','categoria','monto','id_animal_relacionado','id_esquila_relacionada','descripcion','comprobante_url','registrado_por'],
    Citas_Zootecnista: ['id_cita','id_zootecnista','id_usuario_solicitante','id_animal_relacionado','fecha','hora','motivo','estado','notas_zootecnista','calificacion_recibida','fecha_creacion'],
    Calendario_Actividades: ['id_actividad','titulo','tipo','fecha','hora','id_animal_relacionado','id_lote_relacionado','responsable','estado','descripcion'],
    Notificaciones: ['id_notificacion','id_usuario_destino','tipo','mensaje','fecha_generacion','leido','prioridad','id_relacionado','tipo_relacionado'],
    Multimedia: ['id_multimedia','id_animal','tipo_archivo','url_archivo','descripcion','fecha_subida','subido_por'],
    IoT_Dispositivos: ['id_dispositivo','id_animal','tipo_dispositivo','codigo_dispositivo','fecha_instalacion','estado_bateria_pct','estado','ultima_latitud','ultima_longitud','fecha_ultima_lectura'],
    IoT_Lecturas: ['id_lectura','id_dispositivo','fecha_hora','latitud','longitud','temperatura_corporal','nivel_actividad'],
    Listas: ['categoria','valor','orden','activo'],
    Secuencias: ['prefijo','ultimo_numero'],
    Logs_Sistema: ['id_log','fecha_hora','id_usuario','accion','modulo','detalle'],
    Config_Sistema: ['clave','valor','descripcion']
  };

  Object.keys(HEADERS).forEach(name => {
    const sheet = ss.getSheetByName(name);
    sheet.appendRow(HEADERS[name]);
    sheet.setFrozenRows(1);
  });

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('Base de datos inicializada con ' + SHEETS.length + ' hojas');
}

function poblarDatosDemo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoy = new Date();
  const f = (d) => Utilities.formatDate(d, 'America/Lima', 'yyyy-MM-dd');
  const fh = (d) => Utilities.formatDate(d, 'America/Lima', 'yyyy-MM-dd HH:mm');

  // =============================================
  // SECUENCIAS
  // =============================================
  const secSheet = ss.getSheetByName('Secuencias');
  const prefijos = ['USR','ZOO','ANI','FEN','GEN','REP','SAN','ALE','MOV','LOT','ESQ','CTB','CIT','ACT','NOT','MUL','IOT','LEC','LOG'];
  prefijos.forEach(p => secSheet.appendRow([p, 1]));

  // =============================================
  // LISTAS
  // =============================================
  const listasSheet = ss.getSheetByName('Listas');
  const listas = [
    ['Especie','Alpaca',1,'Sí'],['Especie','Llama',2,'Sí'],['Especie','Oveja',3,'Sí'],['Especie','Bovino',4,'Sí'],['Especie','Caprino',5,'Sí'],
    ['Raza','Huacaya',1,'Sí'],['Raza','Suri',2,'Sí'],['Raza','Corriedale',3,'Sí'],['Raza','Hampshire',4,'Sí'],['Raza','Brown Swiss',5,'Sí'],
    ['Procedencia','Nacido en predio',1,'Sí'],['Procedencia','Comprado',2,'Sí'],['Procedencia','Donado',3,'Sí'],
    ['Tipo_Evento_Sanidad','Vacunacion',1,'Sí'],['Tipo_Evento_Sanidad','Desparasitacion',2,'Sí'],['Tipo_Evento_Sanidad','Tratamiento',3,'Sí'],['Tipo_Evento_Sanidad','Diagnostico',4,'Sí'],['Tipo_Evento_Sanidad','Cirugia',5,'Sí'],['Tipo_Evento_Sanidad','Control de rutina',6,'Sí'],
    ['Nivel_Urgencia','Baja',1,'Sí'],['Nivel_Urgencia','Media',2,'Sí'],['Nivel_Urgencia','Alta',3,'Sí'],['Nivel_Urgencia','Critica',4,'Sí'],
    ['Tipo_Movimiento','Ingreso a lote',1,'Sí'],['Tipo_Movimiento','Salida de lote',2,'Sí'],['Tipo_Movimiento','Transferencia',3,'Sí'],
    ['Categoria_Fibra','Baby',1,'Sí'],['Categoria_Fibra','Fleece',2,'Sí'],['Categoria_Fibra','Medium',3,'Sí'],['Categoria_Fibra','Huacaya',4,'Sí'],['Categoria_Fibra','Suri',5,'Sí']
  ];
  listas.forEach(r => listasSheet.appendRow(r));

  // =============================================
  // CONFIG
  // =============================================
  const cfgSheet = ss.getSheetByName('Config_Sistema');
  cfgSheet.appendRow(['nombre_predio','Estancia Pucara','Nombre del predio']);
  cfgSheet.appendRow(['ubicacion_predio','Cusco, Espinar, Yauri','Ubicacion geografica']);
  cfgSheet.appendRow(['moneda','S/','Moneda por defecto']);
  cfgSheet.appendRow(['zonahoraria','America/Lima','Zona horaria']);

  // =============================================
  // USUARIOS DEMO
  // =============================================
  // contrasena: 123456 -> hash sha256('123456' + salt)
  // Pre-calculados para que funcionen
  const usrSheet = ss.getSheetByName('Usuarios');
  usrSheet.appendRow(['USR-00001','Juan Quispe Huaman','juan@agrovelas.pe','juan','a44934344c553000cb198d77cae685d33563617a01b17dc60d45a5557ad9c21d','abc123','Ganadero','999888777','','Activo','2025-01-15','2025-06-20','0']);
  usrSheet.appendRow(['USR-00002','Maria Huillca Condori','maria@agrovelas.pe','maria','a44934344c553000cb198d77cae685d33563617a01b17dc60d45a5557ad9c21d','abc123','Administrador','999888776','','Activo','2025-01-15','2025-06-21','0']);
  usrSheet.appendRow(['USR-00003','Carlos Mamani Quispe','carlos@agrovelas.pe','carlos','a44934344c553000cb198d77cae685d33563617a01b17dc60d45a5557ad9c21d','abc123','Zootecnista','999888775','','Activo','2025-02-01','2025-06-19','0']);
  usrSheet.appendRow(['USR-00004','Rosa Callañaupa Alvarez','rosa@agrovelas.pe','rosa','a44934344c553000cb198d77cae685d33563617a01b17dc60d45a5557ad9c21d','abc123','Veterinario','999888774','','Activo','2025-02-10','2025-06-18','0']);
  usrSheet.appendRow(['USR-00005','Pedro Sucasaire Huaman','pedro@agrovelas.pe','pedro','a44934344c553000cb198d77cae685d33563617a01b17dc60d45a5557ad9c21d','abc123','Productor','999888773','','Activo','2025-03-01','2025-06-17','0']);

  // =============================================
  // ZOOTECNISTAS
  // =============================================
  const zooSheet = ss.getSheetByName('Zootecnistas');
  zooSheet.appendRow(['ZOO-00001','USR-00003','Nutricion Animal',8,4.5,12,50,'Cusco, Espinar','999888775','carlos@agrovelas.pe','Especialista en nutricion de camelidos sudamericanos con experiencia en comunidades altoandinas.','','{}','Disponible']);
  zooSheet.appendRow(['ZOO-00002','','Medicina Veterinaria',12,4.8,20,70,'Cusco, Canchis','999888761','vet.laura@agrovelas.pe','Medico veterinario especializado en reproduccion de alpacas y llamas.','','{}','Disponible']);
  zooSheet.appendRow(['ZOO-00003','','Genetica y Mejoramiento',15,4.2,8,60,'Puno, Melgar','999888762','genetica@agrovelas.pe','Ingeniero zootecnista con maestria en genetica de camelidos.','','{}','Disponible']);
  zooSheet.appendRow(['ZOO-00004','','Sanidad y Epidemiologia',6,3.9,15,45,'Cusco, Acomayo','999888763','sanidad@agrovelas.pe','Joven profesional enfocado en prevencion de enfermedades en ganado altoandino.','','{}','Disponible']);
  zooSheet.appendRow(['ZOO-00005','','Manejo de Pastos',10,4.6,18,55,'Cusco, Canas','999888764','pastos@agrovelas.pe','Ingeniero agronomo especializado en pastos cultivados para zonas altoandinas.','','{}','Disponible']);

  // =============================================
  // LOTES Y CABANAS
  // =============================================
  const lotSheet = ss.getSheetByName('Lotes_Cabanas');
  lotSheet.appendRow(['LOT-00001','Cancha Pucara','Alpaca',100,0,'Sector Pucara Bajo','-14.8000','-71.4000','Juan Quispe','Activo']);
  lotSheet.appendRow(['LOT-00002','Quebrada Honda','Llama',50,0,'Sector Quebrada Honda','-14.8100','-71.4200','Juan Quispe','Activo']);
  lotSheet.appendRow(['LOT-00003','Laderas del Sol','Oveja',80,0,'Sector Laderas','-14.7900','-71.3800','Maria Huillca','Activo']);

  // =============================================
  // ANIMALES DEMO
  // =============================================
  const aniSheet = ss.getSheetByName('Animales');
  const animales = [
    ['ANI-00001','ARQ-001','Luna','Alpaca','Huacaya','Hembra','2022-03-15',3,'Blanco','','','Pacomarca 3','Nacido en predio','LOT-00001','Activo','2025-01-20','USR-00001','','','Ejemplar de alta calidad de fibra'],
    ['ANI-00002','ARQ-002','Inti','Alpaca','Huacaya','Macho','2021-08-10',4,'Marron claro','','','Pacomarca 2','Nacido en predio','LOT-00001','Activo','2025-01-20','USR-00001','','','Reproductor principal'],
    ['ANI-00003','ARQ-003','Wayra','Alpaca','Suri','Hembra','2023-01-20',2,'Beige','ANI-00002','ANI-00001','Linea Suri 1','Nacido en predio','LOT-00001','Activo','2025-02-15','USR-00001','','','Fibra suri de excelente calidad'],
    ['ANI-00004','ARQ-004','Puku','Llama','','Macho','2022-06-01',3,'Marron oscuro','','','Linea Chaku 2','Nacido en predio','LOT-00002','Activo','2025-02-20','USR-00001','','','Animal de carga y fibra'],
    ['ANI-00005','ARQ-005','Killa','Alpaca','Huacaya','Hembra','2023-05-10',2,'Negro','ANI-00002','ANI-00001','Pacomarca 3','Nacido en predio','LOT-00001','Activo','2025-03-01','USR-00001','','','Fibra color negro natural'],
    ['ANI-00006','ARQ-006','Pachamama','Oveja','Corriedale','Hembra','2022-11-20',2,'Blanco','','','Corriedale 1','Comprado','LOT-00003','Activo','2025-03-10','USR-00002','','','Procedente de Puno'],
    ['ANI-00007','ARQ-007','Qori','Alpaca','Huacaya','Hembra','2023-08-05',2,'Blanco','ANI-00002','ANI-00005','Pacomarca 3','Nacido en predio','LOT-00001','Activo','2025-03-15','USR-00001','','','Buena conformacion'],
    ['ANI-00008','ARQ-008','Run Run','Alpaca','Suri','Macho','2022-04-20',3,'Marron','','','Linea Suri 2','Nacido en predio','LOT-00001','Activo','2025-04-01','USR-00001','','','Reproductor suri'],
    ['ANI-00009','ARQ-009','Michi','Llama','','Hembra','2021-12-10',3,'Beige claro','ANI-00004','','Linea Chaku 1','Nacido en predio','LOT-00002','Activo','2025-04-05','USR-00001','','','Buena productora de fibra'],
    ['ANI-00010','ARQ-010','Sol','Alpaca','Huacaya','Hembra','2024-01-15',1,'Blanco','ANI-00002','ANI-00001','Pacomarca 3','Nacido en predio','LOT-00001','Activo','2025-05-10','USR-00002','','','Cria prometedora'],
    ['ANI-00011','ARQ-011','Wari','Oveja','Hampshire','Macho','2023-03-01',2,'Negro con blanco','','','Hampshire 1','Comprado','LOT-00003','Activo','2025-05-15','USR-00002','','','Carnero para mejora genetica'],
    ['ANI-00012','ARQ-012','Sankay','Alpaca','Huacaya','Hembra','2024-03-20',1,'Blanco','ANI-00002','ANI-00007','Pacomarca 3','Nacido en predio','LOT-00001','Activo','2025-05-20','USR-00001','','','Cria de Qori'],
    ['ANI-00013','ARQ-013','Toro','Bovino','Brown Swiss','Macho','2022-07-15',3,'Marron claro','','','Brown Swiss 1','Comprado','','Vendido','2025-06-01','USR-00002','','','Vendido a predio vecino'],
    ['ANI-00014','ARQ-014','Uywa','Alpaca','Huacaya','Hembra','2024-06-10',1,'Blanco','ANI-00008','ANI-00003','Linea Suri 1','Nacido en predio','LOT-00001','Activo','2025-06-10','USR-00001','','','Cria de Wayra con Run Run'],
  ];
  animales.forEach(a => aniSheet.appendRow(a));

  // =============================================
  // REGISTRO SANITARIO
  // =============================================
  const sanSheet = ss.getSheetByName('Sanidad');
  sanSheet.appendRow(['SAN-00001','ANI-00001','2025-03-01','Vacunacion','Vacuna contra enterotoxemia','2 ml','Subcutanea','','','Dr. Carlos Mamani','2025-09-01',0,'Aplicado','']);
  sanSheet.appendRow(['SAN-00002','ANI-00002','2025-03-01','Vacunacion','Vacuna contra enterotoxemia','2 ml','Subcutanea','','','Dr. Carlos Mamani','2025-09-01',0,'Aplicado','']);
  sanSheet.appendRow(['SAN-00003','ANI-00003','2025-03-15','Desparasitacion','Ivermectina 1%','1 ml','Subcutanea','','','Dr. Carlos Mamani','2025-06-15',15,'Aplicado','']);
  sanSheet.appendRow(['SAN-00004','ANI-00004','2025-04-01','Desparasitacion','Ivermectina 1%','1.5 ml','Subcutanea','','','Dr. Rosa Callañaupa','2025-07-01',18,'Aplicado','']);
  sanSheet.appendRow(['SAN-00005','ANI-00005','2025-04-10','Vacunacion','Vacuna triple','2 ml','Intramuscular','','','Dr. Carlos Mamani','2025-10-10',0,'Aplicado','']);
  sanSheet.appendRow(['SAN-00006','ANI-00006','2025-05-05','Desparasitacion','Closantel','1 ml','Oral','','','Dr. Rosa Callañaupa','2025-08-05',12,'Aplicado','']);
  sanSheet.appendRow(['SAN-00007','ANI-00007','2025-06-01','Vacunacion','Vacuna contra neumonia','2 ml','Subcutanea','','','Dr. Carlos Mamani','2025-12-01',0,'Aplicado','']);
  sanSheet.appendRow(['SAN-00008','ANI-00003','2025-06-15','Desparasitacion','Ivermectina 1%','1 ml','Subcutanea','','','Dr. Rosa Callañaupa','2025-09-15',15,'Aplicado','']);
  sanSheet.appendRow(['SAN-00009','ANI-00010','2025-06-20','Vacunacion','Vacuna contra enterotoxemia','1 ml','Subcutanea','','','Dr. Carlos Mamani','2025-12-20',0,'Programado','']);
  sanSheet.appendRow(['SAN-00010','ANI-00009','2025-06-25','Control de rutina','','','','Control general','Control de peso y condicion corporal','Dr. Rosa Callañaupa','',25,'Programado','']);
  sanSheet.appendRow(['SAN-00011','ANI-00014','2025-06-28','Vacunacion','Vacuna triple','1 ml','Intramuscular','','','Dr. Carlos Mamani','2025-12-28',0,'Programado','']);

  // =============================================
  // ALERTAS
  // =============================================
  const aleSheet = ss.getSheetByName('Animales_Alerta');
  aleSheet.appendRow(['ALE-00001','ANI-00005','2025-06-10','USR-00001','Pérdida de peso y apetito reducido','Media','ZOO-00004','','En seguimiento','','','']);
  aleSheet.appendRow(['ALE-00002','ANI-00009','2025-06-18','USR-00001','Cojea del miembro posterior izquierdo','Alta','ZOO-00001','ZOO-00004','Derivado','','','']);
  aleSheet.appendRow(['ALE-00003','ANI-00006','2025-06-22','USR-00002','Tos frecuente y secrecion nasal','Media','ZOO-00004','','En seguimiento','','','']);

  // =============================================
  // REPRODUCCION
  // =============================================
  const repSheet = ss.getSheetByName('Reproduccion');
  repSheet.appendRow(['REP-00001','ANI-00001','Empadre/Monta','2025-03-10','ANI-00002','Monta natural','Positivo','2025-08-10',0,'','USR-00001','']);
  repSheet.appendRow(['REP-00002','ANI-00005','Empadre/Monta','2025-04-05','ANI-00002','Monta natural','Positivo','2025-09-05',0,'','USR-00001','']);
  repSheet.appendRow(['REP-00003','ANI-00003','Empadre/Monta','2025-04-20','ANI-00008','Monta natural','Positivo','2025-09-20',0,'','USR-00001','']);
  repSheet.appendRow(['REP-00004','ANI-00001','Parto','2025-08-10','','','','',1,'ANI-00010','USR-00001','Parto normal sin complicaciones']);
  repSheet.appendRow(['REP-00005','ANI-00003','Parto','2025-09-20','','','','',1,'ANI-00014','USR-00001','']);
  repSheet.appendRow(['REP-00006','ANI-00007','Empadre/Monta','2025-06-01','ANI-00002','Monta natural','Pendiente','','',0,'','USR-00001','']);

  // =============================================
  // ESQUILA
  // =============================================
  const esqSheet = ss.getSheetByName('Esquila');
  esqSheet.appendRow(['ESQ-00001','ANI-00001','2025-02-10',1.85,'Baby',18.5,8,'Blanco','Venta','Coop. Textil Cusco',85,157.25,'USR-00001','Fibra primera calidad']);
  esqSheet.appendRow(['ESQ-00002','ANI-00002','2025-02-10',2.1,'Fleece',22.3,9,'Marron claro','Venta','Coop. Textil Cusco',75,157.5,'USR-00001','']);
  esqSheet.appendRow(['ESQ-00003','ANI-00003','2025-02-12',1.6,'Baby',17.2,7.5,'Beige','Venta','Artesanos Acomayo',90,144,'USR-00001','Fibra suri premium']);
  esqSheet.appendRow(['ESQ-00004','ANI-00005','2025-02-15',1.7,'Fleece',23.1,8.5,'Negro','Venta','Tienda Kuna',70,119,'USR-00001','']);
  esqSheet.appendRow(['ESQ-00005','ANI-00004','2025-03-01',1.3,'Medium',28.5,7,'Marron oscuro','Venta','Artesanos locales',45,58.5,'USR-00001','Fibra de llama']);
  esqSheet.appendRow(['ESQ-00006','ANI-00007','2025-03-05',1.55,'Baby',19.2,8,'Blanco','Almacen',0,0,'USR-00001','Guardada para venta posterior']);

  // =============================================
  // CONTABILIDAD
  // =============================================
  const ctbSheet = ss.getSheetByName('Contabilidad');
  ctbSheet.appendRow(['CTB-00001','2025-02-10','Ingreso','Venta de fibra',157.25,'','ESQ-00001','Venta fibra alpaca Luna - 1.85 kg Baby','','USR-00001']);
  ctbSheet.appendRow(['CTB-00002','2025-02-10','Ingreso','Venta de fibra',157.5,'','ESQ-00002','Venta fibra alpaca Inti - 2.1 kg Fleece','','USR-00001']);
  ctbSheet.appendRow(['CTB-00003','2025-02-12','Ingreso','Venta de fibra',144,'','ESQ-00003','Venta fibra alpaca Wayra - 1.6 kg Baby Suri','','USR-00001']);
  ctbSheet.appendRow(['CTB-00004','2025-02-15','Ingreso','Venta de fibra',119,'','ESQ-00004','Venta fibra alpaca Killa - 1.7 kg Negro','','USR-00001']);
  ctbSheet.appendRow(['CTB-00005','2025-03-01','Ingreso','Venta de fibra',58.5,'','ESQ-00005','Venta fibra llama Puku - 1.3 kg Medium','','USR-00001']);
  ctbSheet.appendRow(['CTB-00006','2025-03-05','Egreso','Insumos',250,'','','Compra de vacunas y desparasitantes','','USR-00001']);
  ctbSheet.appendRow(['CTB-00007','2025-03-15','Egreso','Alimentacion',180,'','','Compra de suplemento alimenticio','','USR-00001']);
  ctbSheet.appendRow(['CTB-00008','2025-04-01','Egreso','Servicios',120,'','','Pago de consulta zootecnista','','USR-00001']);
  ctbSheet.appendRow(['CTB-00009','2025-04-10','Ingreso','Venta de fibra',85,'','ESQ-00006','Venta parcial fibra almacenada','','USR-00001']);
  ctbSheet.appendRow(['CTB-00010','2025-05-01','Egreso','Mantenimiento',350,'','','Mantenimiento de cercos e infraestructura','','USR-00001']);
  ctbSheet.appendRow(['CTB-00011','2025-05-10','Ingreso','Venta de ganado',1200,'ANI-00013','','Venta de bovino Toro a predio vecino','','USR-00002']);
  ctbSheet.appendRow(['CTB-00012','2025-06-01','Egreso','Servicios',200,'','','Analisis de laboratorio y diagnósticos','','USR-00001']);
  ctbSheet.appendRow(['CTB-00013','2025-06-15','Ingreso','Venta de fibra',96,'','ESQ-00006','Liquidacion final fibra almacenada','','USR-00001']);
  ctbSheet.appendRow(['CTB-00014','2025-06-20','Egreso','Insumos',165,'','','Compra de productos veterinarios','','USR-00002']);

  // =============================================
  // CALENDARIO / ACTIVIDADES
  // =============================================
  const calSheet = ss.getSheetByName('Calendario_Actividades');
  const manana = new Date(hoy.getTime() + 86400000);
  const pasadomanana = new Date(hoy.getTime() + 2*86400000);
  const proxsemana = new Date(hoy.getTime() + 7*86400000);
  calSheet.appendRow(['ACT-00001','Vacunacion general','Sanidad',f(manana),'08:00','','LOT-00001','USR-00001','Programado','Vacunacion contra enterotoxemia para lote Pucara']);
  calSheet.appendRow(['ACT-00002','Revision de alertas','Sanidad',f(pasadomanana),'10:00','ALE-00001','','ZOO-00004','Programado','Seguimiento de perdida de peso en Killa']);
  calSheet.appendRow(['ACT-00003','Pesaje de crias','Manejo',f(proxsemana),'09:00','','','USR-00001','Programado','Pesaje de crias nacidas en la temporada']);
  calSheet.appendRow(['ACT-00004','Clasificacion de fibra','Produccion',f(proxsemana),'14:00','','','USR-00001','Programado','Clasificar fibra almacenada para venta']);
  calSheet.appendRow(['ACT-00005','Desparasitacion general','Sanidad',f(new Date(hoy.getTime() + 14*86400000)),'08:00','','LOT-00002','USR-00001','Programado','Desparasitacion de lote Quebrada Honda']);
  calSheet.appendRow(['ACT-00006','Mantenimiento de infraestructura','Manejo',f(new Date(hoy.getTime() + 3*86400000)),'07:00','','','USR-00002','Programado','Reparar cercos del sector Laderas']);

  // =============================================
  // NOTIFICACIONES
  // =============================================
  const notSheet = ss.getSheetByName('Notificaciones');
  notSheet.appendRow(['NOT-00001','USR-00001','alerta','Alerta activa: Killa (ANI-00005) presenta perdida de peso',fh(new Date(hoy.getTime() - 3600000)),'no','Alta','ALE-00001','alerta']);
  notSheet.appendRow(['NOT-00002','USR-00001','recordatorio','Vacunacion programada para manana en lote Pucara',fh(new Date(hoy.getTime() - 7200000)),'no','Media','ACT-00001','actividad']);
  notSheet.appendRow(['NOT-00003','USR-00001','sistema','Reporte mensual de fibra disponible para venta',fh(new Date(hoy.getTime() - 86400000)),'si','Baja','','']);
  notSheet.appendRow(['NOT-00004','USR-00002','alerta','Alerta derivada: Michi (ANI-00009) requiere atencion veterinaria urgente',fh(new Date(hoy.getTime() - 1800000)),'no','Alta','ALE-00002','alerta']);
  notSheet.appendRow(['NOT-00005','USR-00001','recordatorio','Pesaje de crias programado para la proxima semana',fh(new Date(hoy.getTime() - 86400000)),'no','Baja','ACT-00003','actividad']);

  // =============================================
  // CITAS ZOOTECNISTA
  // =============================================
  const citSheet = ss.getSheetByName('Citas_Zootecnista');
  citSheet.appendRow(['CIT-00001','ZOO-00004','USR-00001','ANI-00005',f(manana),'10:00','Evaluacion de perdida de peso y estado general','Pendiente','',0,fh(hoy)]);
  citSheet.appendRow(['CIT-00002','ZOO-00001','USR-00001','ANI-00009',f(pasadomanana),'14:00','Evaluacion de cojera en miembro posterior','Pendiente','',0,fh(hoy)]);
  citSheet.appendRow(['CIT-00003','ZOO-00003','USR-00001','ANI-00002',f(proxsemana),'09:00','Evaluacion genetica para empadre','Pendiente','',0,fh(hoy)]);

  // =============================================
  // IOT DISPOSITIVOS
  // =============================================
  const iotDSheet = ss.getSheetByName('IoT_Dispositivos');
  iotDSheet.appendRow(['IOT-00001','ANI-00001','Collar GPS','ALP-GPS-001','2025-01-20',85,'Activo','-14.7950','-71.4050',fh(hoy)]);
  iotDSheet.appendRow(['IOT-00002','ANI-00002','Collar GPS','ALP-GPS-002','2025-01-20',72,'Activo','-14.7980','-71.4080',fh(hoy)]);
  iotDSheet.appendRow(['IOT-00003','ANI-00003','Collar GPS','ALP-GPS-003','2025-02-15',90,'Activo','-14.7930','-71.4020',fh(hoy)]);
  iotDSheet.appendRow(['IOT-00004','ANI-00005','Collar GPS','ALP-GPS-004','2025-03-01',45,'Activo','-14.7960','-71.4030',fh(hoy)]);
  iotDSheet.appendRow(['IOT-00005','ANI-00004','Collar GPS','LLAMA-GPS-001','2025-02-20',60,'Activo','-14.8100','-71.4200',fh(hoy)]);

  // =============================================
  // IOT LECTURAS
  // =============================================
  const iotLSheet = ss.getSheetByName('IoT_Lecturas');
  for (let i = 0; i < 5; i++) {
    const h = new Date(hoy.getTime() - i * 3600000);
    iotLSheet.appendRow(['LEC-00'+(i+1),'IOT-00001',fh(h),'-14.795'+i,'-71.40'+(5-i),38.5,75]);
  }

  // =============================================
  // LOGS
  // =============================================
  const logSheet = ss.getSheetByName('Logs_Sistema');
  logSheet.appendRow(['LOG-00001',fh(new Date(hoy.getTime() - 86400000)),'USR-00001','inicio_sesion','auth','Inicio de sesion exitoso']);
  logSheet.appendRow(['LOG-00002',fh(new Date(hoy.getTime() - 7200000)),'USR-00001','registro_animal','animales','Registro de animal ANI-00014']);
  logSheet.appendRow(['LOG-00003',fh(new Date(hoy.getTime() - 3600000)),'USR-00002','inicio_sesion','auth','Inicio de sesion exitoso']);

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('Datos demo cargados exitosamente!');
}
