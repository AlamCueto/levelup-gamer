import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from '../App';

// Chart.js necesita canvas, que jsdom no implementa: se simulan los gráficos.
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="grafico-barras" />,
  Doughnut: () => <div data-testid="grafico-dona" />,
}));

const ADMIN = { nombre: 'Administrador', email: 'admin@levelup.cl', password: 'admin123', role: 'admin', esDuoc: false };

const irA = (ruta) => window.history.pushState({}, '', ruta);
const abrir = (ruta = '/', user = null) => {
  if (user) localStorage.setItem('user', JSON.stringify(user));
  irA(ruta);
  return render(<App />);
};
const escribir = (el, value) => fireEvent.change(el, { target: { value } });

beforeEach(() => {
  vi.spyOn(window, 'alert').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('Navegación, Home y Catálogo', () => {
  it('Home muestra carrusel, garantías y productos', () => {
    abrir('/');
    expect(screen.getByText(/Lo más Buscado en la Squad/i)).toBeTruthy();
    expect(screen.getByText('PlayStation 5')).toBeTruthy();
    expect(screen.getByText(/Mostrando 6 productos/)).toBeTruthy();
  });

  it('Filtra por cada categoría del Home', () => {
    abrir('/');
    fireEvent.click(screen.getByRole('button', { name: /Consolas/ }));
    expect(screen.getByText(/Mostrando 1 productos/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /PCs Gamer/ }));
    expect(screen.getByText(/Mostrando 1 productos/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Periféricos/ }));
    expect(screen.getByText(/Mostrando 3 productos/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Sillas Gamer/ }));
    expect(screen.getByText(/Mostrando 1 productos/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Todo el Setup/ }));
    expect(screen.getByText(/Mostrando 6 productos/)).toBeTruthy();
  });

  it('Catálogo lista los productos y agrega al carrito actualizando el contador', () => {
    abrir('/catalogo');
    expect(screen.getByText(/Catálogo Completo de Productos/)).toBeTruthy();
    fireEvent.click(screen.getAllByText('Añadir al Carrito')[0]);
    fireEvent.click(screen.getAllByText('Añadir al Carrito')[0]);
    expect(screen.getByText('2', { selector: '.badge' })).toBeTruthy();
  });

  it('Navega con los enlaces del menú', () => {
    abrir('/');
    fireEvent.click(screen.getByText('Catálogo', { selector: 'a' }));
    expect(screen.getByText(/Catálogo Completo/)).toBeTruthy();
    fireEvent.click(screen.getByText('Contacto', { selector: 'a' }));
    expect(screen.getByText(/Soporte Level-Up/)).toBeTruthy();
    fireEvent.click(screen.getByText(/Registro \(20% Off Duoc\)/));
    expect(screen.getByText(/Crear Cuenta Gamer/)).toBeTruthy();
    fireEvent.click(screen.getByText('Iniciar Sesión', { selector: 'a' }));
    expect(screen.getByText('Ingresar a la Squad')).toBeTruthy();
  });
});

describe('Login y sesión', () => {
  it('Rechaza credenciales inválidas', () => {
    abrir('/login');
    escribir(screen.getByPlaceholderText('tu@correo.cl'), 'nadie@x.cl');
    escribir(screen.getByPlaceholderText('••••••••'), 'mala');
    fireEvent.click(screen.getByText('Ingresar a la Squad'));
    expect(screen.getByText(/Credenciales inválidas/)).toBeTruthy();
  });

  it('Admin inicia sesión, ve el panel y puede cerrar sesión', () => {
    abrir('/login');
    escribir(screen.getByPlaceholderText('tu@correo.cl'), 'admin@levelup.cl');
    escribir(screen.getByPlaceholderText('••••••••'), 'admin123');
    fireEvent.click(screen.getByText('Ingresar a la Squad'));
    expect(screen.getByText(/DASHBOARD MÉTRICO/)).toBeTruthy();
    fireEvent.click(screen.getByText('Salir'));
    expect(screen.getByText('Iniciar Sesión', { selector: 'a' })).toBeTruthy();
  });

  it('Un usuario normal inicia sesión y vuelve al inicio con su insignia Duoc', () => {
    localStorage.setItem('registeredUsers', JSON.stringify([
      { nombre: 'Ana', email: 'ana@duocuc.cl', password: 'abcdef', role: 'user', esDuoc: true },
    ]));
    abrir('/login');
    escribir(screen.getByPlaceholderText('tu@correo.cl'), 'ana@duocuc.cl');
    escribir(screen.getByPlaceholderText('••••••••'), 'abcdef');
    fireEvent.click(screen.getByText('Ingresar a la Squad'));
    expect(screen.getByText(/Lo más Buscado/)).toBeTruthy();
    expect(screen.getByText('Duoc 20% OFF')).toBeTruthy();
    expect(screen.queryByText('Panel Admin')).toBeNull();
  });
});

describe('Panel de administración', () => {
  it('Deniega el acceso a quien no es admin', () => {
    abrir('/admin');
    expect(screen.getByText(/Acceso denegado/)).toBeTruthy();
  });

  it('Muestra métricas, gráficos e inventario al admin', () => {
    abrir('/admin', ADMIN);
    expect(screen.getByTestId('grafico-barras')).toBeTruthy();
    expect(screen.getByTestId('grafico-dona')).toBeTruthy();
    expect(screen.getByText('6 UNID.')).toBeTruthy();
    expect(screen.getByText('Panel Admin')).toBeTruthy();
  });

  const completarNuevo = (nombre, precio) => {
    escribir(screen.getByPlaceholderText('Nombre del producto'), nombre);
    escribir(screen.getByPlaceholderText('Ej. 49990'), precio);
    escribir(screen.getByPlaceholderText('https://...'), 'https://img.test/a.png');
    escribir(screen.getByPlaceholderText('Escribe detalles del producto...'), 'Descripción');
  };

  it('Valida nombre corto y precio no positivo al publicar', () => {
    abrir('/admin', ADMIN);
    completarNuevo('ab', '1000');
    fireEvent.click(screen.getByText('Guardar Producto'));
    expect(screen.getByText(/al menos 3 caracteres/)).toBeTruthy();
    completarNuevo('Teclado nuevo', '0');
    fireEvent.click(screen.getByText('Guardar Producto'));
    expect(screen.getByText(/superior a \$0/)).toBeTruthy();
  });

  it('Publica un producto nuevo (con y sin etiqueta)', () => {
    abrir('/admin', ADMIN);
    completarNuevo('Monitor 240Hz', '250000');
    escribir(screen.getByPlaceholderText('Ej: OFERTA, TOP VENTAS'), 'oferta');
    fireEvent.click(screen.getByText('Guardar Producto'));
    expect(screen.getByText(/añadido con éxito/)).toBeTruthy();
    expect(screen.getByText('7 UNID.')).toBeTruthy();
    expect(screen.getAllByText('OFERTA').length).toBe(2);
    completarNuevo('Alfombrilla XL', '15000');
    fireEvent.click(screen.getByText('Guardar Producto'));
    expect(screen.getByText('8 UNID.')).toBeTruthy();
  });

  it('Edita un producto del inventario', () => {
    abrir('/admin', ADMIN);
    fireEvent.click(screen.getAllByText('✏️')[0]);
    const nombre = screen.getByDisplayValue('PlayStation 5');
    escribir(nombre, 'PlayStation 5 Pro');
    fireEvent.click(screen.getByText('Actualizar'));
    expect(screen.getByText(/Se actualizó el producto "PlayStation 5 Pro"/)).toBeTruthy();
  });

  it('Cancela la edición con el botón Cancelar', async () => {
    abrir('/admin', ADMIN);
    fireEvent.click(screen.getAllByText('✏️')[0]);
    fireEvent.click(screen.getByText('Cancelar'));
    await waitFor(() => expect(screen.queryByText('Actualizar')).toBeNull());
  });

  it('Elimina un producto solo si el admin confirma', () => {
    abrir('/admin', ADMIN);
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
    fireEvent.click(screen.getAllByText('🗑️')[0]);
    expect(screen.getByText('6 UNID.')).toBeTruthy();
    fireEvent.click(screen.getAllByText('🗑️')[0]);
    expect(screen.getByText('5 UNID.')).toBeTruthy();
    expect(screen.getByText(/eliminado del inventario/)).toBeTruthy();
    expect(confirmar).toHaveBeenCalledTimes(2);
  });

  it('Busca por nombre, id y etiqueta, y avisa si no hay resultados', () => {
    abrir('/admin', ADMIN);
    const buscador = screen.getByPlaceholderText(/Buscar producto/);
    escribir(buscador, 'mouse');
    expect(screen.getByText('Mouse Inalámbrico 26K DPI', { selector: 'td' })).toBeTruthy();
    escribir(buscador, 'CG001');
    expect(screen.getByText('PC Gamer ASUS ROG Strix', { selector: 'td' })).toBeTruthy();
    escribir(buscador, 'top ventas');
    expect(screen.getByText('PlayStation 5', { selector: 'td' })).toBeTruthy();
    escribir(buscador, 'zzzz');
    expect(screen.getByText(/No se encontraron productos/)).toBeTruthy();
  });

  it('Pagina el inventario cuando hay más de 5 productos', () => {
    abrir('/admin', ADMIN);
    fireEvent.click(screen.getByText('2', { selector: '.page-link' }));
    expect(screen.getByText('Mouse Inalámbrico 26K DPI', { selector: 'td' })).toBeTruthy();
  });

  it('Cierra la alerta de mensajes', () => {
    abrir('/admin', ADMIN);
    completarNuevo('ab', '1000');
    fireEvent.click(screen.getByText('Guardar Producto'));
    fireEvent.click(screen.getByLabelText('Close alert'));
    expect(screen.queryByText(/al menos 3 caracteres/)).toBeNull();
  });
});

describe('Carrito y Checkout', () => {
  const agregarYAbrirCarrito = () => {
    fireEvent.click(screen.getAllByText('Añadir al Carrito')[0]);
    fireEvent.click(screen.getByRole('button', { name: /^🛒 Carrito/ }));
  };

  it('El carrito vacío muestra el aviso', () => {
    abrir('/');
    fireEvent.click(screen.getByRole('button', { name: /^🛒 Carrito/ }));
    expect(screen.getByText('El carrito está vacío.')).toBeTruthy();
  });

  it('Muestra el detalle, elimina, vacía y cierra el carrito', () => {
    abrir('/catalogo');
    agregarYAbrirCarrito();
    expect(screen.getByText(/Tu Carrito Gamer/)).toBeTruthy();
    expect(screen.getByText(/Total: \$549\.990 CLP/)).toBeTruthy();
    fireEvent.click(screen.getByText(/Eliminar/));
    expect(screen.getByText('El carrito está vacío.')).toBeTruthy();
    fireEvent.click(screen.getByText('Seguir Comprando'));
  });

  it('Vacía el carrito completo', () => {
    abrir('/catalogo');
    agregarYAbrirCarrito();
    fireEvent.click(screen.getByText('Vaciar Carrito'));
    expect(screen.getByText('El carrito está vacío.')).toBeTruthy();
  });

  it('Aplica el 20% Duoc en el carrito para un alumno con sesión', () => {
    abrir('/catalogo', { nombre: 'Ana', email: 'ANA@duocuc.cl', role: 'user' });
    agregarYAbrirCarrito();
    expect(screen.getByText(/Descuento Duoc \(20%\)/)).toBeTruthy();
    expect(screen.getByText(/Total: \$439\.992 CLP/)).toBeTruthy();
  });

  it('Completa una compra exitosa con boleta y descuento Duoc', () => {
    abrir('/catalogo', { nombre: 'Ana', email: 'ana@duocuc.cl', role: 'user' });
    agregarYAbrirCarrito();
    fireEvent.click(screen.getByText(/Proceder al Pago/));
    expect(screen.getByText(/CHECKOUT - DATOS DE ENVÍO/)).toBeTruthy();
    escribir(screen.getByPlaceholderText('Ej. Perez'), 'Soto');
    escribir(screen.getByPlaceholderText(/Los Crisantemos/), 'Av. Siempre Viva 742');
    escribir(screen.getByPlaceholderText('Ej. Depto 603'), '12');
    escribir(screen.getByPlaceholderText(/Dejar con el conserje/), 'Tocar timbre');
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Valparaíso' } });
    fireEvent.click(screen.getByText(/Realizar Pago/));
    expect(screen.getByText(/Se ha realizado la compra. nro #123456/)).toBeTruthy();
    expect(screen.getByText(/Total pagado: \$439\.992/)).toBeTruthy();
    expect(screen.getByText(/Incluye 20% OFF/)).toBeTruthy();
    expect(screen.getByDisplayValue('Tocar timbre')).toBeTruthy();

    const imprimir = vi.fn();
    window.print = imprimir;
    fireEvent.click(screen.getByText('Imprimir boleta en PDF'));
    expect(imprimir).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Enviar boleta por email'));
    expect(window.alert).toHaveBeenCalledWith('Boleta enviada al correo registrado.');
    fireEvent.click(screen.getByText('Volver a la Tienda'));
    expect(screen.getByText(/Lo más Buscado/)).toBeTruthy();
  });

  it('La boleta usa valores por omisión sin apellido, depto ni indicaciones y el correlativo avanza', () => {
    abrir('/catalogo');
    agregarYAbrirCarrito();
    fireEvent.click(screen.getByText(/Proceder al Pago/));
    fireEvent.submit(screen.getByText(/Realizar Pago/).closest('form'));
    expect(screen.getByText(/nro #123456/)).toBeTruthy();
    expect(screen.getByDisplayValue('Gamer')).toBeTruthy();
    expect(screen.getByDisplayValue('-')).toBeTruthy();
    expect(screen.getByDisplayValue('Sin indicaciones especiales.')).toBeTruthy();
    expect(localStorage.getItem('siguienteOrden')).toBe('123457');
  });

  it('Simula un pago rechazado y permite reintentar o volver al catálogo', () => {
    abrir('/catalogo');
    agregarYAbrirCarrito();
    fireEvent.click(screen.getByText(/Proceder al Pago/));
    escribir(document.querySelector('[name=nombre]'), 'Pepe');
    escribir(screen.getByPlaceholderText('Ej. Perez'), 'Soto');
    escribir(document.querySelector('[name=email]'), 'pepe@mail.com');
    escribir(screen.getByPlaceholderText(/Los Crisantemos/), 'Calle ERROR 1');
    fireEvent.click(screen.getByText(/Realizar Pago/));
    expect(screen.getByText(/NO SE PUDO REALIZAR EL PAGO/)).toBeTruthy();
    fireEvent.click(screen.getByText('Reintentar Pago'));
    expect(screen.getByText(/CHECKOUT - DATOS DE ENVÍO/)).toBeTruthy();
    fireEvent.click(screen.getByLabelText(/Simular Pago Rechazado/));
    escribir(screen.getByPlaceholderText(/Los Crisantemos/), 'Calle 2');
    fireEvent.click(screen.getByText(/Realizar Pago/));
    fireEvent.click(screen.getByText('Volver al Catálogo'));
    expect(screen.getByText(/Catálogo Completo/)).toBeTruthy();
  });
});

describe('Contacto y chatbot', () => {
  it('Envía el formulario de contacto y oculta la confirmación tras 4 s', () => {
    vi.useFakeTimers();
    abrir('/contacto');
    escribir(screen.getByLabelText('Nombre'), 'Ana');
    escribir(screen.getByLabelText('Correo de Contacto'), 'ana@mail.com');
    fireEvent.change(screen.getByLabelText('Asunto'), { target: { value: 'Garantías' } });
    escribir(screen.getByLabelText('Mensaje'), 'Hola');
    fireEvent.click(screen.getByText('Enviar Consulta'));
    expect(screen.getByText(/Gracias por contactarnos/)).toBeTruthy();
    act(() => { vi.advanceTimersByTime(4100); });
    expect(screen.queryByText(/Gracias por contactarnos/)).toBeNull();
  });

  it('Permite cerrar la confirmación de envío', () => {
    abrir('/contacto');
    escribir(screen.getByLabelText('Nombre'), 'Ana');
    escribir(screen.getByLabelText('Correo de Contacto'), 'ana@mail.com');
    escribir(screen.getByLabelText('Mensaje'), 'Hola');
    fireEvent.click(screen.getByText('Enviar Consulta'));
    fireEvent.click(screen.getByLabelText('Close alert'));
    expect(screen.queryByText(/Gracias por contactarnos/)).toBeNull();
  });

  const preguntar = (texto) => {
    fireEvent.change(screen.getByPlaceholderText(/Haz una pregunta/), { target: { value: texto } });
    fireEvent.click(screen.getByText('Enviar', { selector: 'button' }));
    act(() => { vi.advanceTimersByTime(700); });
  };

  it('El chatbot responde por tema y aplica el filtro ético', () => {
    vi.useFakeTimers();
    abrir('/contacto');
    fireEvent.click(screen.getByText(/Iniciar Chat con IA/));
    const casos = [
      ['quiero hackear', /Aviso Ético/],
      ['tienen descuento?', /20% OFF de por vida/],
      ['cuanto tarda el envio', /envíos express/],
      ['cual es el horario', /Nos encontramos/],
      ['tengo una devolucion', /6 meses de garantía/],
      ['que gpu me recomienda', /PCs Gamer armados/],
      ['hola', /¿Cómo estás\?/],
      ['blablabla', /Entiendo tu mensaje/],
    ];
    casos.forEach(([pregunta, esperado]) => {
      preguntar(pregunta);
      expect(screen.getByText(esperado)).toBeTruthy();
    });
  });

  it('El chatbot ignora mensajes vacíos y puede cerrarse y reabrirse con la burbuja', () => {
    abrir('/contacto');
    fireEvent.click(screen.getByTitle(/Asistente Level-Bot/));
    fireEvent.click(screen.getByText('Enviar', { selector: 'button' }));
    expect(screen.getAllByText(/Hola! Soy Level-Bot/).length).toBe(1);
    fireEvent.click(document.querySelector('.btn-close'));
    expect(screen.getByTitle(/Asistente Level-Bot/)).toBeTruthy();
  });
});

describe('Registro desde la aplicación', () => {
  it('Registra un usuario Duoc, inicia sesión automática y redirige al inicio', () => {
    abrir('/registro');
    escribir(screen.getByLabelText(/Nombre Completo/), 'Ana');
    escribir(screen.getByLabelText(/Correo Electrónico/), 'ana@duocuc.cl');
    escribir(screen.getByLabelText(/^Contraseña/), 'abcdef');
    escribir(screen.getByLabelText(/Confirmar Contraseña/), 'abcdef');
    fireEvent.click(screen.getByLabelText(/Acepto los términos/));
    fireEvent.click(screen.getByRole('button', { name: /Activar 20% OFF/ }));
    expect(window.alert).toHaveBeenCalled();
    expect(screen.getByText('Duoc 20% OFF')).toBeTruthy();
  });
});
