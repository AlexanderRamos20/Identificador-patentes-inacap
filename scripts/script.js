import { Api_token, Api_url } from "./config.js";

const alumnos = [
    {
        nombre: "Valentina Soto",
        rut: "19.435.782-1",
        carrera: "Ing. en electricidad",
        patente: "KKXD69"
    },
    {
        nombre: "Tomás Herrera",
        rut: "20.137.594-3",
        carrera: "Mecánica",
        patente: "CPWG10"
    },
    {
        nombre: "Camilo Rivas",
        rut: "21.034.812-7",
        carrera: "Ing. en informática",
        patente: "FRHV49"
    },
    {
        nombre: "Ignacio Fuentes",
        rut: "18.029.457-6",
        carrera: "Administración",
        patente: "JXPL21"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("imagen-a-escanear");
    const fileName = document.getElementById("file-name");
    const fileButton = document.getElementById("file-button");
    const enviar = document.getElementById("enviar");

    fileButton.addEventListener("click", () => input.click());

    input.addEventListener("change", () => {
        const file = input.files[0];
        const previewContainer = document.getElementById("analysis-result");
        const existingPreview = document.getElementById("preview-imagen");

        if (existingPreview) {
            existingPreview.remove();
        }

        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                const newImg = document.createElement("img");
                newImg.src = e.target.result;
                newImg.id = "preview-imagen";
                newImg.className = "preview";
                previewContainer.prepend(newImg);
            };
            reader.readAsDataURL(file);

            fileName.textContent = file.name;
            enviar.disabled = false;
        } else {
            fileName.textContent = "Ningún archivo seleccionado";
            enviar.disabled = true;
        }
    });

    enviar.addEventListener("click", enviarImagen);
});

async function enviarImagen() {
    const input = document.getElementById("imagen-a-escanear");
    const file = input.files[0];

    if (!file) {
        alert("Por favor, selecciona una imagen.");
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
        console.log("Respuesta API:", json);

        mostrarResultados(json);

    } catch (error) {
        console.error("Error al enviar la imagen:", error);
        const datosPlaca = document.getElementById("placa-info");
        if (datosPlaca) {
            datosPlaca.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        }
    }
}

function mostrarResultados(data) {
    const resultadosConsultaPlaca = document.getElementById("resultados-consulta-placa");
    const resultadosConsultaBD = document.getElementById("resultados-consulta-bd");

    // Obtener y preservar la imagen actual si existe
    let datosPlaca = document.getElementById("placa-info");
    if (!datosPlaca) {
        datosPlaca = document.createElement("div");
        datosPlaca.id = "placa-info";
        resultadosConsultaPlaca.appendChild(datosPlaca);
    }

    // Limpia solo la información textual
    datosPlaca.innerHTML = "";
    resultadosConsultaBD.innerHTML = "<h2>Información de la Base de Datos</h2>";

    if (data.results && data.results.length > 0) {
        const resultado = data.results[0];
        datosPlaca.innerHTML = `
            <p><strong>Patente:</strong> ${resultado.plate}</p>
        `;

        const alumno = alumnos.find(a =>
            a.patente.toLowerCase() === resultado.plate.toLowerCase()
        );

        if (alumno) {
            resultadosConsultaBD.innerHTML += `
                <p><strong>Alumno:</strong> ${alumno.nombre}</p>
                <p><strong>RUT:</strong> ${alumno.rut}</p>
                <p><strong>Carrera:</strong> ${alumno.carrera}</p>
            `;
        } else {
            resultadosConsultaBD.innerHTML += '<p class="error">Patente no vinculada a ningún alumno.</p>';
        }
    } else {
        datosPlaca.innerHTML = '<p class="error">No se detectó ninguna patente en la imagen.</p>';
    }
}