import {Api_token, Api_url} from "./config.js";

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
    const resultadosDiv = document.getElementById('resultados-consulta-placa');
    resultadosDiv.innerHTML = '';

    if (data.results && data.results.length > 0) {
        const resultado = data.results[0];
        resultadosDiv.innerHTML = `
            <h2>Resultado:</h2>
            <p><strong>Patente:</strong> ${resultado.plate}</p>
            <p><strong>Región detectada:</strong> ${resultado.region.code}</p>
        `;
    } else {
        resultadosDiv.innerHTML = '<p>No se detectó ninguna patente en la imagen.</p>';
    }
}

document.getElementById('enviar').addEventListener('click', enviarImagen);
