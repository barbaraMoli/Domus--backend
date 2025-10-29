# 🚀 Guía de Despliegue en Render

## 📋 Requisitos Previos

1. **Cuenta en Render**: [https://render.com](https://render.com)
2. **Repositorio Git**: Tu código debe estar en GitHub, GitLab o Bitbucket
3. **Variables de Entorno**: Tienes que tener las credenciales de Supabase y otras APIs

---

## 🔧 Paso 1: Preparar el Repositorio

Asegúrate de que tu código esté subido a GitHub/GitLab/Bitbucket.

### Archivos Importantes que ya tienes:
- ✅ `package.json` (con script `start`)
- ✅ `index.js` (archivo principal)
- ✅ Variables de entorno configuradas

---

## 🌐 Paso 2: Crear Servicio en Render

1. **Entra a Render**: [https://dashboard.render.com](https://dashboard.render.com)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio (GitHub/GitLab/Bitbucket)
4. Selecciona el repositorio que contiene tu backend

---

## ⚙️ Paso 3: Configurar el Servicio

### Configuración Básica:
- **Name**: `domus-backend` (o el nombre que prefieras)
- **Region**: Elige la más cercana (ej: `US East`)
- **Branch**: `main` o `master` (según tu repo)
- **Root Directory**: `Backend` (si tu proyecto está en una carpeta, deja vacío si está en la raíz)

### Build & Start:
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Plan:
- **Free**: Si es un proyecto personal/prueba
- **Starter/Pro**: Si necesitas más recursos

---

## 🔐 Paso 4: Configurar Variables de Entorno

En la sección **"Environment"** de Render, agrega estas variables:

### ⚠️ OBLIGATORIAS (sin estas no funcionará):
```
SUPABASE_URL=tu_url_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
JWT_SECRET=tu_clave_secreta_super_segura_minimo_32_caracteres
```

### 📱 OPCIONALES (según tus necesidades):
```
PORT=10000
CORS_ORIGIN=*
MQTT_BROKER=mqtt://tu_servidor_mqtt:1883
ROBOT_ID=1
DEFAULT_USER_ID=1
OPENAI_API_KEY=tu_key_de_openai
OPEN_API_KEY=tu_key_alternativa
```

### 🔒 Notas Importantes:
- **NO** pongas comillas `"` alrededor de los valores
- Render automáticamente asigna el puerto, pero puedes usar `PORT` si lo necesitas
- `CORS_ORIGIN` debe ser la URL de tu frontend (ej: `https://tu-frontend.vercel.app`)
- Para múltiples orígenes: `https://app1.com,https://app2.com`

---

## 📝 Paso 5: Desplegar

1. Click en **"Create Web Service"**
2. Render comenzará a construir y desplegar tu aplicación
3. Verás el log en tiempo real
4. Espera a que termine (5-10 minutos la primera vez)

---

## ✅ Paso 6: Verificar

Cuando termine el despliegue:
- Tu app estará disponible en: `https://tu-app-name.onrender.com`
- Prueba: `https://tu-app-name.onrender.com/health`
- Deberías ver: `{"status":"OK"...}`

---

## 🐛 Troubleshooting

### Error: "Build failed"
- Revisa los logs en Render
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate que `node` versión sea compatible (tu `package.json` dice `>=18 <20`)

### Error: "Cannot connect to Supabase"
- Verifica que `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` estén correctos
- Asegúrate que no tengan espacios extra

### Error: "Port already in use"
- No necesitas configurar un puerto, Render lo hace automáticamente
- Pero tu código usa `process.env.PORT || 3000` que está bien ✅

### CORS Error
- Verifica `CORS_ORIGIN` en las variables de entorno
- Debe ser la URL exacta de tu frontend (con `https://`)

---

## 🔄 Actualizaciones

Cada vez que hagas `git push` a la rama principal, Render **automáticamente**:
1. Detecta el cambio
2. Reconstruye la app
3. La redespliega

Puedes ver el progreso en el dashboard de Render.

---

## 💰 Costos

- **Free**: 
  - El servicio se "duerme" después de 15 min de inactividad
  - Primera petición tarda ~30 segundos (spinning up)
  - Perfecto para desarrollo/pruebas

- **Starter ($7/mes)**:
  - Siempre activo
  - Mejor performance
  - Sin delays en la primera petición

---

## 📚 Recursos Adicionales

- Documentación de Render: [https://render.com/docs](https://render.com/docs)
- Dashboard: [https://dashboard.render.com](https://dashboard.render.com)

---

## ✅ Checklist Final

Antes de desplegar, verifica:

- [ ] Código en GitHub/GitLab/Bitbucket
- [ ] `package.json` tiene `"start": "node index.js"`
- [ ] Variables de entorno configuradas en Render
- [ ] `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` están correctos
- [ ] `JWT_SECRET` tiene al menos 32 caracteres
- [ ] Si usas WebSockets, Render los soporta automáticamente ✅

---

¡Listo! 🎉 Tu backend debería estar corriendo en Render.

