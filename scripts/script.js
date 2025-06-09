import {Api_token, Api_url} from "./config.js";

var alumnos = [
      {
    "nombre": "Valentina Soto",
    "rut": "19.435.782-1",
    "carrera": "Ing. en electricidad",
    "patente": "KKXD69"
  },
  {
    "nombre": "Tomás Herrera",
    "rut": "20.137.594-3",
    "carrera": "Mecánica",
    "patente": "CPWG10"
  },
  {
    "nombre": "Camilo Rivas",
    "rut": "21.034.812-7",
    "carrera": "Ing. en informática",
    "patente": "FRHV49"
  },
  {
    "nombre": "Ignacio Fuentes",
    "rut": "18.029.457-6",
    "carrera": "Administración",
    "patente": "JXPL21"
  }
];

async function enviarImagen() {
    const input = document.getElementById('imagen-a-escanear');
    const file = input.files[0];

    if (!file) {
        alert('Por favor, selecciona una imagen.');
        return;
    }

    const formData = new FormData();
    formData.append("upload", file);
    formData.append("regions", "cl"); 

    try {
        const response = await fetch(Api_url, {
            method: "POST",
            headers: {
                Authorization: `Token ${Api_token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        console.log('Respuesta API:', json);

        mostrarResultados(json);

    } catch (error) {
        console.error('Error al enviar la imagen:', error);
        document.getElementById('resultados-consulta').innerText = `Error: ${error.message}`;
    }
}

function mostrarResultados(data) {
    const resultadosConsultaPlaca = document.getElementById('resultados-consulta-placa');
    const resultadosConsultaBD = document.getElementById('resultados-consulta-bd');
    resultadosConsultaPlaca.innerHTML = '';
    resultadosConsultaBD.innerHTML = '';

    if (data.results && data.results.length > 0) {
        const resultado = data.results[0];
        resultadosConsultaPlaca.innerHTML = `
            <h2>Resultado:</h2>
            <p><strong>Patente:</strong> ${resultado.plate}</p>
        `;
        var correspondeAAlumno = alumnos.find(alumno => alumno.patente.toLowerCase() === resultado.plate);
        if (correspondeAAlumno){
            resultadosConsultaBD.innerHTML = `
            <p><strong>Alumno:</strong> ${correspondeAAlumno.nombre}</p>
            <p><strong>RUT:</strong> ${correspondeAAlumno.rut}</p>
            <p><strong>Carrera:</strong> ${correspondeAAlumno.carrera}</p>
            `;
        } else {resultadosConsultaBD.innerHTML = 'Patente no vinculada a ningún alumno.'}
    } else {
        resultadosConsultaPlaca.innerHTML = '<p>No se detectó ninguna patente en la imagen.</p>';
    }
}

document.getElementById('enviar').addEventListener('click', enviarImagen);
