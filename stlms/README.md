# 🚦 STLMS — Sistema de Gestión de Semáforos Inteligentes

**Taller del Patrón de Diseño State** — Caso de estudio real con Spring Boot + React

---

## 📖 Caso de Estudio

Una central de control de tráfico necesita gestionar decenas de semáforos en una ciudad. Cada semáforo tiene estados operacionales distintos (**ROJO, AMARILLO, VERDE, AMARILLO PARPADEO, EMERGENCIA, FUERA DE SERVICIO**), y el comportamiento cambia drásticamente según el estado actual.

**Sin el Patrón State**, el controlador tendría cadenas masivas de condicionales:

```java
// ❌ Sin patrón State — código frágil y difícil de mantener
if (currentState == RED) {
    if (action == NEXT) setState(GREEN);
    else if (action == EMERGENCY) setState(EMERGENCY);
    // ...
} else if (currentState == GREEN) {
    if (action == NEXT) setState(YELLOW);
    // ...
}
// Esto crece indefinidamente con cada nuevo estado o acción
```

**Con el Patrón State**, cada estado encapsula su propio comportamiento:

```java
// ✅ Con patrón State — limpio, extensible, sin condicionales
public class RedLightState implements TrafficLightState {
    public void handleNextState(TrafficLightContext ctx) {
        ctx.transitionTo(new GreenLightState(), "Ciclo normal", "SYSTEM");
    }
}
```

---

## 🏗️ Cómo el Patrón State Resuelve el Problema

| Problema | Solución con State Pattern |
|----------|---------------------------|
| Condicionales gigantes | Cada estado es una clase independiente |
| Agregar un nuevo estado rompe el código | Solo se agrega una nueva clase |
| Comportamiento mezclado | Cada estado encapsula su lógica |
| Transiciones inválidas difíciles de controlar | Cada estado declara sus transiciones permitidas |

### Diagrama UML del Patrón

```
«interface»
TrafficLightState
├── handleNextState(context)
├── handleEmergency(context)
├── handleRestore(context)
├── handleMaintenance(context)
├── getStateName(): String
├── getColor(): String
├── getDurationInSeconds(): int
├── isVehicleAllowedToProceed(): boolean
├── isPedestrianAllowedToCross(): boolean
└── getAllowedTransitions(): List<String>
        ▲
        │ implements
        ├── RedLightState        (30s, vehículos: STOP, peatones: GO)
        ├── GreenLightState      (45s, vehículos: GO,   peatones: STOP)
        ├── YellowLightState     (5s,  vehículos: STOP, peatones: STOP)
        ├── FlashingYellowState  (∞,   vehículos: YIELD, peatones: YIELD)
        ├── EmergencyState       (∞,   todos: STOP)
        └── OutOfServiceState    (∞,   sin señal)

TrafficLightContext  ←──── tiene ──── TrafficLightState (actual)
├── nextState()              delegado al estado actual
├── triggerEmergency()       delegado al estado actual
├── restore()                delegado al estado actual
├── triggerMaintenance()     delegado al estado actual
└── transitionTo(newState)   valida + persiste + cambia estado
```

---

## 🚀 Instrucciones de Configuración

### Requisitos
- Java 21+
- Maven 3.8+
- Node.js 18+

### ▶ Iniciar con un solo comando

```powershell
# Desde la carpeta stlms/
.\iniciar.ps1
```

Maven compila el frontend automáticamente, lo empaqueta dentro del JAR y arranca Spring Boot.

Abre el navegador en: **http://localhost:8080**

### Accesos directos
| URL | Descripción |
|-----|-------------|
| http://localhost:8080 | Aplicación completa (frontend + backend) |
| http://localhost:8080/swagger-ui.html | Documentación API interactiva |
| http://localhost:8080/h2-console | Consola de base de datos H2 |

### Desarrollo (frontend en vivo)
Si quieres editar el frontend con hot-reload:

```bash
# Terminal 1 — Backend
.\iniciar-backend.ps1

# Terminal 2 — Frontend (hot-reload en http://localhost:5173)
cd frontend
npm run dev
```

---

## 📚 Documentación de la API

Swagger UI disponible en: **http://localhost:8080/swagger-ui.html**

Consola H2 (base de datos): **http://localhost:8080/h2-console**
- JDBC URL: `jdbc:h2:mem:stlmsdb`
- Usuario: `sa` / Sin contraseña

---

## 🎨 Estados y su Comportamiento

| Estado | Color | Duración | Vehículos | Peatones |
|--------|-------|----------|-----------|----------|
| 🔴 ROJO | `#ef4444` | 30s | Detenidos | Pueden cruzar |
| 🟡 AMARILLO | `#eab308` | 5s | Preparar parada | Esperar |
| 🟢 VERDE | `#22c55e` | 45s | Pueden avanzar | Detenidos |
| 🟠 AMARILLO PARPADEO | `#f59e0b` | Indefinida | Ceder paso | Ceder paso |
| 🚨 EMERGENCIA | `#dc2626` | Hasta restaurar | Detenidos | Detenidos |
| ⚫ FUERA DE SERVICIO | `#6b7280` | Hasta restaurar | Sin señal | Sin señal |

### Reglas de Transición

```
ROJO           → VERDE, EMERGENCIA, FUERA_DE_SERVICIO
VERDE          → AMARILLO, EMERGENCIA, FUERA_DE_SERVICIO
AMARILLO       → ROJO, EMERGENCIA, FUERA_DE_SERVICIO
AMAR. PARPADEO → ROJO, EMERGENCIA, FUERA_DE_SERVICIO
EMERGENCIA     → Estado previo a la emergencia
FUERA SERVICIO → ROJO (siempre, nunca al estado previo)
```

---

## 🧪 Ejecutar Tests

```bash
cd stlms/backend
mvn test
```

---

## 📁 Estructura del Proyecto

```
stlms/
├── backend/          Spring Boot 3 + H2 + JPA
│   └── src/main/java/com/stlms/
│       ├── pattern/state/    ← 6 estados concretos + interfaz
│       ├── pattern/context/  ← TrafficLightContext (corazón del patrón)
│       ├── service/          ← Lógica de negocio
│       ├── controller/       ← REST API
│       └── domain/           ← Entidades JPA
└── frontend/         React + Vite + Tailwind
    └── src/
        ├── components/  ← TrafficLightVisual, ControlPanel, etc.
        └── pages/       ← Dashboard, IntersectionDetail, History
```
