var httpReq = new XMLHttpRequest();
var nodeActual;
window.onload = getMaterias;

var callBackMaterias = function () {

    document.getElementById("divLoading").className = "divLoadingVisible";
    if (httpReq.readyState === 4) {
        if (httpReq.status == 200) {
            document.getElementById("divLoading").className = "divLoadingInvisible"
            localStorage.setItem("materias", httpReq.responseText);
            cargarMateriasTable();
        }

    }
}

function Cerrar() {
    document.getElementById("divNuevoPost").className = "divNuevoPost divNuevoPostInvisible";
}

function eliminar() {
    var idMateria = document.getElementById("indexMateria").value;
    var obj = {id: idMateria};
    var jsonOut = JSON.stringify(obj);
    ajax("POST", "http://localhost:3000/eliminar", jsonOut, true, callBackEliminar);
}

function callBackEliminar() {
    document.getElementById("divLoading").className = "divLoadingVisible";
    if (httpReq.readyState === 4) {
        if (httpReq.status == 200) {
            console.log(httpReq.responseText);
            var respuesta = JSON.parse(httpReq.responseText);
            document.getElementById("divLoading").className = "divLoadingInvisible"
            document.getElementById("divNuevoPost").className = "divNuevoPost divNuevoPostInvisible";
            if (respuesta.type == "error") {
                alert(respuesta.message);
            } else {
                console.log("Se Elimino correctamente.");
                nodeActual.parentNode.removeChild(nodeActual);
                Cerrar();
            }
        }

    }
}

function modificar() {

    var idMateria = document.getElementById("indexMateria").value;
    var nombreMateria = document.getElementById("txtNombre").value;
    var cuatrimestre = document.getElementById("selCuatrimestre").value;

    var fecha = document.getElementById("dateFechafinal").value.split("-");
    var fechaToJson = fecha[2] + "/" + fecha[1] + "/" + fecha[0];


    var turno;
    if (document.getElementById("turnon").checked == true) {
        turno = document.getElementById("turnon").value;
    } else {
        turno = document.getElementById("turnom").value;
    }

    if (validarCampos(nombreMateria, fecha) == true) {
        var obj = {id: idMateria, nombre: nombreMateria, cuatrimestre: cuatrimestre, fechaFinal: fechaToJson, turno: turno};
        var jsonOut = JSON.stringify(obj);
        ajax("POST", "http://localhost:3000/editar", jsonOut, true, callBackMod);
    }

}

function callBackMod() {
    document.getElementById("divLoading").className = "divLoadingVisible";
    if (httpReq.readyState === 4) {
        if (httpReq.status == 200) {
            console.log(httpReq.responseText);
            var respuesta = JSON.parse(httpReq.responseText);
            document.getElementById("divLoading").className = "divLoadingInvisible"
            document.getElementById("divNuevoPost").className = "divNuevoPost divNuevoPostInvisible";
            if (respuesta.type == "error") {
                alert(respuesta.message);
            } else {
                console.log("Se modificó correctamente.");


                var nTr = document.createElement("tr");

                var nTdNombre = document.createElement("td");
                var nTdCuatrimestre = document.createElement("td");
                var nTdFechaFinal = document.createElement("td");
                var nTdTurno = document.createElement("td");

                var nTdID = document.createElement("td");
                nTdID.setAttribute("style", "display:none");

                nTr.appendChild(nTdNombre);
                nTr.appendChild(nTdCuatrimestre);
                nTr.appendChild(nTdFechaFinal);
                nTr.appendChild(nTdTurno);
                nTr.appendChild(nTdID);

                var txtNombre = document.createTextNode(document.getElementById("txtNombre").value);
                var txtCuatrimestre = document.createTextNode(document.getElementById("selCuatrimestre").value);
                var fecha = document.getElementById("dateFechafinal").value.split("-");
                fecha = fecha[2] + "/" + fecha[1] + "/" + fecha[0];
                var txtFechaFinal = document.createTextNode(fecha);

                var turno;
                if (document.getElementById("turnom").checked == true) {
                    turno = document.getElementById("turnom").value;
                } else {
                    turno = document.getElementById("turnon").value;
                }

                var txtTurno = document.createTextNode(turno);

                var id = document.createTextNode(document.getElementById("indexMateria").value);


                nTdNombre.appendChild(txtNombre);
                nTdCuatrimestre.appendChild(txtCuatrimestre);
                nTdFechaFinal.appendChild(txtFechaFinal);
                nTdTurno.appendChild(txtTurno);
                nTdID.appendChild(id);

                nTr.addEventListener("dblclick", EventosDclick);

                nodeActual.parentNode.replaceChild(nTr, nodeActual);
                Cerrar();
            }
        }

    }
}

function EventosDclick(e) {
    e.preventDefault();

    document.getElementById("txtNombre").value = e.currentTarget.valueOf().cells[0].innerText;
    document.getElementById("selCuatrimestre").value = e.currentTarget.valueOf().cells[1].innerText;

    var format = e.currentTarget.valueOf().cells[2].innerText.split("/");
    format = format[1] + "-" + format[0] + "-" + format[2];
    var date = new Date(format);

    document.getElementById("dateFechafinal").value = date.toISOString().slice(0, 10);


    if (e.currentTarget.valueOf().cells[3].innerText == "Noche") {
        document.getElementById("turnon").checked = true;
        document.getElementById("turnom").checked = false;
    } else {
        document.getElementById("turnom").checked = true;
        document.getElementById("turnon").checked = false;
    }


    document.getElementById("indexMateria").value = e.currentTarget.valueOf().cells[4].innerText;
    nodeActual = e.currentTarget;

    document.getElementById("txtNombre").className = "txtNewPostName";
    document.getElementById("dateFechafinal").className="txtNewPostFecha";
    document.getElementById("divNuevoPost").className = "divNuevoPost divNuevoPostVisible";
}

function getMaterias() {
    ajax("GET", "http://localhost:3000/materias", "", true, callBackMaterias);
}

function ajax(metodo, url, parametros, tipo, callback) {
    httpReq.onreadystatechange = callback;
    if (metodo === "GET") {
        httpReq.open("GET", url, tipo);
        httpReq.send();
    } else {
        httpReq.open("POST", url, tipo);
        //httpReq.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        httpReq.setRequestHeader("Content-Type", "application/json");
        httpReq.send(parametros);
    }

}

function cargarMateriasTable() {
    //console.log("cargarLista");

    var materias = JSON.parse(localStorage.getItem("materias"));
    var count = Object.keys(materias).length;

    var tbody = document.getElementById("tablaResultados");

    for (var i = 0; i < count; i++) {
        var nTr = document.createElement("tr");

        var nTdNombre = document.createElement("td");
        var nTdCuatrimestre = document.createElement("td");
        var nTdFechaFinal = document.createElement("td");
        var nTdTurno = document.createElement("td");

        var nTdID = document.createElement("td");
        nTdID.setAttribute("style", "display:none");

        nTr.appendChild(nTdNombre);
        nTr.appendChild(nTdCuatrimestre);
        nTr.appendChild(nTdFechaFinal);
        nTr.appendChild(nTdTurno);
        nTr.appendChild(nTdID);


        var txtNombre = document.createTextNode(materias[i].nombre);
        var txtCuatrimestre = document.createTextNode(materias[i].cuatrimestre);
        var txtFechaFinal = document.createTextNode(materias[i].fechaFinal);
        var txtTurno = document.createTextNode(materias[i].turno);

        var id = document.createTextNode(materias[i].id);


        nTdNombre.appendChild(txtNombre);
        nTdCuatrimestre.appendChild(txtCuatrimestre);
        nTdFechaFinal.appendChild(txtFechaFinal);
        nTdTurno.appendChild(txtTurno);
        nTdID.appendChild(id);

        nTr.addEventListener("dblclick", EventosDclick);
        tbody.appendChild(nTr);
    }
}

function validarCampos(nombre, fecha) {
var retorno = true;
    if(nombre.length<6){
    retorno = false;
        document.getElementById("txtNombre").className = "txtNewPostNameError";
    }else{
        document.getElementById("txtNombre").className = "txtNewPostName";
    }

    var dateValidar = new Date();
    dateValidar.setFullYear(fecha[0]);
    dateValidar.setMonth(fecha[1]-1);
    dateValidar.setDate(fecha[2]);

    var hoy = new Date()
    console.log(dateValidar);


    console.log(hoy);
    if (dateValidar <= hoy) {
       retorno = false;
        console.log("fecha menor o igual a hoy");
        document.getElementById("dateFechafinal").className="txtNewPostFechaError";
    }else{
        document.getElementById("dateFechafinal").className="txtNewPostFecha";
    }
    return retorno;
}