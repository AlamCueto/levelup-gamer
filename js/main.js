document.addEventListener('DOMContentLoaded', () => {

    // SISTEMA DE GAMIFICACIÓN Y REFERIDOS
  
    let puntosLevelUp = parseInt(localStorage.getItem('levelup_puntos')) || 0;

    function obtenerNivelGamer(puntos) {
        if (puntos >= 1000) return { nivel: 'Leyenda Gamer 🏆', rango: 4 };
        if (puntos >= 500)  return { nivel: 'Pro Gamer 🎮', rango: 3 };
        if (puntos >= 200)  return { nivel: 'Gamer Promesa ⚡', rango: 2 };
        return { nivel: 'Novato 👾', rango: 1 };
    }

    function obtenerDescuentoPorPuntos(puntos) {
        if (puntos >= 1000) return 0.25; // 25% descuento
        if (puntos >= 500)  return 0.15; // 15% descuento
        if (puntos >= 200)  return 0.05; // 5% descuento
        return 0;
    }

    function sumarPuntosLevelUp(cantidad) {
        puntosLevelUp += cantidad;
        localStorage.setItem('levelup_puntos', puntosLevelUp);
        actualizarInterfazGamificacion();
    }

    function obtenerCodigoReferidoUsuario() {
        let codigo = localStorage.getItem('mi_codigo_referido');
        if (!codigo) {
            codigo = 'GAMER-' + Math.random().toString(36).substring(2, 7).toUpperCase();
            localStorage.setItem('mi_codigo_referido', codigo);
        }
        return codigo;
    }

    function actualizarInterfazGamificacion() {
        const infoNivel = obtenerNivelGamer(puntosLevelUp);
    
        const elPuntos = document.getElementById('puntosGamerText');
        const elNivel = document.getElementById('nivelGamerText');
        const elCodigo = document.getElementById('miCodigoReferidoText');

        if (elPuntos) elPuntos.textContent = `${puntosLevelUp} Puntos LevelUp`;
        if (elNivel) elNivel.textContent = infoNivel.nivel;
        if (elCodigo) elCodigo.textContent = obtenerCodigoReferidoUsuario();
    }

    // CARRITO DE COMPRAS   

    let carrito = JSON.parse(localStorage.getItem('levelup_cart')) || [];
    let esUsuarioDuoc = localStorage.getItem('es_duoc') === 'true';

    const cartCountEl = document.getElementById('cartCount');
    const modalCarrito = document.getElementById('modalCarrito');
    const btnAbrirCarrito = document.getElementById('btnAbrirCarrito');
    const btnCerrarCarrito = document.getElementById('btnCerrarCarrito');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartDescuentoEl = document.getElementById('cartDescuento');
    const cartTotalEl = document.getElementById('cartTotal');
    const btnVaciarCarrito = document.getElementById('btnVaciarCarrito');
    const btnPagarCarrito = document.getElementById('btnPagarCarrito');

    function guardarYActualizarCarrito() {
        localStorage.setItem('levelup_cart', JSON.stringify(carrito));
        actualizarBadgesYModal();
    }

    function actualizarBadgesYModal() {
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        if (cartCountEl) cartCountEl.textContent = totalItems;

        if (cartItemsContainer) {
            if (carrito.length === 0) {
                cartItemsContainer.innerHTML = '<p class="cart-vacio-msg">Tu carrito gamer está vacío actualmente.</p>';
                if (cartSubtotalEl) cartSubtotalEl.textContent = '$0 CLP';
                if (cartDescuentoEl) cartDescuentoEl.textContent = '-$0 CLP';
                if (cartTotalEl) cartTotalEl.textContent = '$0 CLP';
            } else {
                let html = '<div class="cart-items-list">';
                let subtotal = 0;

                carrito.forEach((item, index) => {
                    const itemTotal = item.precio * item.cantidad;
                    subtotal += itemTotal;
                    html += `
                        <div class="cart-item-row">
                            <div class="cart-item-info">
                                <strong>${item.nombre}</strong><br>
                                <small>$${item.precio.toLocaleString('es-CL')} CLP c/u</small>
                            </div>
                            <div class="cart-item-controls">
                                <button onclick="cambiarCantidad(${index}, -1)">-</button>
                                <span>${item.cantidad}</span>
                                <button onclick="cambiarCantidad(${index}, 1)">+</button>
                                <button onclick="eliminarDelCarrito(${index})" class="btn-eliminar">&times;</button>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
                cartItemsContainer.innerHTML = html;

                // Cálculo de Descuentos (Duoc + Nivel Gamificado)
                const porcentajeDuoc = esUsuarioDuoc ? 0.20 : 0;
                const porcentajeNivel = obtenerDescuentoPorPuntos(puntosLevelUp);
                const porcentajeTotal = porcentajeDuoc + porcentajeNivel;

                const descuento = subtotal * porcentajeTotal;
                const total = subtotal - descuento;

                if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toLocaleString('es-CL')} CLP`;
                if (cartDescuentoEl) cartDescuentoEl.textContent = `-$${descuento.toLocaleString('es-CL')} CLP`;
                if (cartTotalEl) cartTotalEl.textContent = `$${total.toLocaleString('es-CL')} CLP`;
            }
        }
    }

    window.cambiarCantidad = function(index, delta) {
        carrito[index].cantidad += delta;
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
        guardarYActualizarCarrito();
    };

    window.eliminarDelCarrito = function(index) {
        carrito.splice(index, 1);
        guardarYActualizarCarrito();
    };

    // Añadir al Carrito
    document.querySelectorAll('.btn-agregar-cart').forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            const id = boton.getAttribute('data-id');
            const nombre = boton.getAttribute('data-nombre');
            const precio = parseInt(boton.getAttribute('data-precio'), 10);

            const existe = carrito.find(item => item.id === id);
            if (existe) {
                existe.cantidad++;
            } else {
                carrito.push({ id, nombre, precio, cantidad: 1 });
            }

            guardarYActualizarCarrito();
            mostrarToastNotification(`¡${nombre} añadido al carrito! 🛒`);
        });
    });

    if (btnAbrirCarrito && modalCarrito) {
        btnAbrirCarrito.addEventListener('click', (e) => {
            e.preventDefault();
            modalCarrito.style.display = 'block';
        });
    }

    if (btnCerrarCarrito && modalCarrito) {
        btnCerrarCarrito.addEventListener('click', () => {
            modalCarrito.style.display = 'none';
        });
    }

    if (btnVaciarCarrito) {
        btnVaciarCarrito.addEventListener('click', () => {
            carrito = [];
            guardarYActualizarCarrito();
        });
    }

    if (btnPagarCarrito) {
        btnPagarCarrito.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert('El carrito está vacío.');
                return;
            }
            alert('¡Gracias por tu compra en Level-Up Gamer! Tu pedido ha sido procesado.');
            
            // Otorgar puntos por compra (ej: 50 puntos por compra)
            sumarPuntosLevelUp(50);
            
            carrito = [];
            guardarYActualizarCarrito();
            if (modalCarrito) modalCarrito.style.display = 'none';
        });
    }


    // VALIDACIÓN FORMULARIO DE REGISTRO
    
    const formRegistro = document.getElementById('formRegistro');
    const inputCorreoReg = document.getElementById('correoRegistro');
    const badgeDuoc = document.getElementById('descuentoDuocBadge');

    function esCorreoDuocValido(correo) {
        const regexDuoc = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|duocuc\.cl|profesor\.duoc\.cl)$/i;
        return regexDuoc.test(correo.trim());
    }

    if (inputCorreoReg && badgeDuoc) {
        inputCorreoReg.addEventListener('input', () => {
            if (esCorreoDuocValido(inputCorreoReg.value)) {
                badgeDuoc.style.display = 'block';
                localStorage.setItem('es_duoc', 'true');
                esUsuarioDuoc = true;
            } else {
                badgeDuoc.style.display = 'none';
                localStorage.setItem('es_duoc', 'false');
                esUsuarioDuoc = false;
            }
            actualizarBadgesYModal();
        });
    }

    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();
            let esValido = true;

            const nombre = document.getElementById('nombreRegistro');
            const correo = document.getElementById('correoRegistro');
            const fecha = document.getElementById('fechaNacimiento');
            const pass = document.getElementById('passwordRegistro');
            const confirmPass = document.getElementById('confirmPassword');

            limpiarErrores();

            if (!nombre || !nombre.value.trim() || nombre.value.trim().length < 3) {
                mostrarError('errorNombreReg', 'Ingresa un nombre válido (mínimo 3 caracteres).');
                esValido = false;
            }

            const regexGeneralCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!correo || !regexGeneralCorreo.test(correo.value.trim())) {
                mostrarError('errorCorreoReg', 'Ingresa un correo electrónico válido.');
                esValido = false;
            }

            if (!fecha || !fecha.value) {
                mostrarError('errorFecha', 'Selecciona tu fecha de nacimiento.');
                esValido = false;
            }

            if (!pass || !pass.value || pass.value.length < 6) {
                mostrarError('errorPassword', 'La contraseña debe tener al menos 6 caracteres.');
                esValido = false;
            }

            if (!confirmPass || pass.value !== confirmPass.value) {
                mostrarError('errorConfirmPass', 'Las contraseñas no coinciden.');
                esValido = false;
            }

            if (esValido) {
                // 1. Sumar puntos de bienvenida por registro
                sumarPuntosLevelUp(100);

                // 2. Procesar código de referido opcional
                const inputReferido = document.getElementById('codigoReferido');
                if (inputReferido && inputReferido.value.trim() !== '') {
                    const puntosAmigo = parseInt(localStorage.getItem('puntos_referidor')) || 0;
                    localStorage.setItem('puntos_referidor', puntosAmigo + 150);
                }

                // 3. Generar código de referido propio
                const miCodigo = obtenerCodigoReferidoUsuario();

                // 4. Mostrar mensaje de éxito detallado
                const exitoBox = document.getElementById('mensajeExitoReg');
                if (exitoBox) {
                    let mensaje = `🎉 <strong>¡Registro completado con éxito!</strong><br>
                    Has ganado <strong>100 Puntos LevelUp</strong> de bienvenida.<br>
                    Tu código para referir amigos es: <strong style="color: #39FF14;">${miCodigo}</strong>.`;

                    if (esCorreoDuocValido(correo.value)) {
                        mensaje += '<br>✨ Además se activó tu 20% OFF permanente por correo Duoc.';
                    }

                    exitoBox.innerHTML = mensaje;
                    exitoBox.style.display = 'block';
                }

                formRegistro.reset();
            }
        });
    }

    // VALIDACIÓN FORMULARIO DE CONTACTO

    const formContacto = document.getElementById('formContacto');
    if (formContacto) {
        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();
            let esValido = true;

            const nombre = document.getElementById('nombreContacto');
            const correo = document.getElementById('correoContacto');
            const asunto = document.getElementById('asuntoContacto');
            const mensaje = document.getElementById('mensajeContacto');

            limpiarErroresContacto();

            if (!nombre || !nombre.value.trim()) {
                mostrarError('errorNombre', 'Por favor ingresa tu nombre completo.');
                esValido = false;
            }

            const regexGeneralCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!correo || !regexGeneralCorreo.test(correo.value.trim())) {
                mostrarError('errorCorreo', 'Ingresa un correo electrónico de contacto válido.');
                esValido = false;
            }

            if (!asunto || !asunto.value) {
                mostrarError('errorAsunto', 'Selecciona un motivo de consulta.');
                esValido = false;
            }

            if (!mensaje || !mensaje.value.trim() || mensaje.value.trim().length < 10) {
                mostrarError('errorMensaje', 'El mensaje debe contener al menos 10 caracteres.');
                esValido = false;
            }

            if (esValido) {
                const exitoBox = document.getElementById('mensajeExito');
                if (exitoBox) {
                    exitoBox.textContent = '💬 Consulta enviada con éxito. Nuestro equipo técnico te responderá pronto.';
                    exitoBox.style.display = 'block';
                }
                formContacto.reset();
            }
        });
    }

    // FUNCIONES AUXILIARES

    function mostrarError(idElemento, texto) {
        const el = document.getElementById(idElemento);
        if (el) el.textContent = texto;
    }

    function limpiarErrores() {
        ['errorNombreReg', 'errorCorreoReg', 'errorFecha', 'errorPassword', 'errorConfirmPass'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '';
        });
    }

    function limpiarErroresContacto() {
        ['errorNombre', 'errorCorreo', 'errorAsunto', 'errorMensaje'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '';
        });
    }

    function mostrarToastNotification(msg) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Inicialización al cargar la página
    actualizarBadgesYModal();
    actualizarInterfazGamificacion();
});