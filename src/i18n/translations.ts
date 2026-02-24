// src/i18n/translations.ts

export type Lang = "ES" | "EN";

export const translations = {

  /* ══════════════════════════════════════════
     HEADER
  ══════════════════════════════════════════ */
  header: {
    myAccount: { ES: "Mi Cuenta",   EN: "My Account"   },
    cart:      { ES: "Carrito",     EN: "Cart"          },
  },

  /* ══════════════════════════════════════════
     HOME
  ══════════════════════════════════════════ */
  home: {
    heroTitle:    { ES: "CATÁLOGO",          EN: "CATALOG"         },
    heroSpan:     { ES: "DIGITAL GAMER",     EN: "DIGITAL GAMER"   },
    heroSubtitle: {
      ES: "Elige tu juego favorito y compra de forma rápida, segura y sin complicaciones.",
      EN: "Choose your favorite game and buy quickly, safely, and hassle-free.",
    },
  },

  /* ══════════════════════════════════════════
     CART DRAWER
  ══════════════════════════════════════════ */
  cart: {
    title:         { ES: "Tu Carrito",              EN: "Your Cart"           },
    empty:         { ES: "Tu carrito está vacío",   EN: "Your cart is empty"  },
    emptyHint:     { ES: "Agrega productos para comenzar tu compra", EN: "Add products to start shopping" },
    total:         { ES: "Total:",                  EN: "Total:"              },
    checkout:      { ES: "Proceder al Pago",        EN: "Proceed to Checkout" },
    clear:         { ES: "Vaciar carrito",          EN: "Clear cart"          },
    close:         { ES: "Cerrar carrito",          EN: "Close cart"          },
    decrease:      { ES: "Disminuir cantidad",      EN: "Decrease quantity"   },
    increase:      { ES: "Aumentar cantidad",       EN: "Increase quantity"   },
    remove:        { ES: "Eliminar producto",       EN: "Remove product"      },
  },

  /* ══════════════════════════════════════════
     CHECKOUT
  ══════════════════════════════════════════ */
  checkout: {
    title:           { ES: "Datos del cliente",       EN: "Customer Details"       },
    summary:         { ES: "Resumen de compra",       EN: "Order Summary"          },
    quantity:        { ES: "Cantidad:",               EN: "Quantity:"              },
    total:           { ES: "Total",                   EN: "Total"                  },
    emptyCart:       { ES: "Tu carrito está vacío",   EN: "Your cart is empty"     },
    backCatalog:     { ES: "Volver al catálogo",      EN: "Back to catalog"        },
    name:            { ES: "Nombre completo",         EN: "Full name"              },
    email:           { ES: "Correo electrónico",      EN: "Email address"          },
    epicUser:        { ES: "Usuario de Epic Games",   EN: "Epic Games username"    },
    uid:             { ES: "UID del jugador",         EN: "Player UID"             },
    selectServer:    { ES: "Selecciona tu servidor",  EN: "Select your server"     },
    gamePassLink:    { ES: "Enlace de tu Game Pass",  EN: "Your Game Pass link"    },
    discordType:     { ES: "Tipo de producto Discord",EN: "Discord product type"   },
    discordNitro:    { ES: "Discord Nitro",           EN: "Discord Nitro"          },
    discordBoost:    { ES: "Mejoras de servidor",     EN: "Server Boosts"          },
    discordDeco:     { ES: "Decoraciones / Placas",   EN: "Decorations / Badges"   },
    paymentMethod:   { ES: "Método de pago",          EN: "Payment method"         },
    notes:           { ES: "Notas o instrucciones adicionales (opcional)", EN: "Additional notes (optional)" },
    confirm:         { ES: "Confirmar compra",        EN: "Confirm purchase"       },
    processing:      { ES: "Procesando...",           EN: "Processing..."          },
    terms:           { ES: "Al confirmar, aceptas nuestros términos y condiciones.", EN: "By confirming, you accept our terms and conditions." },
    selectPayment:   { ES: "Selecciona un método de pago", EN: "Select a payment method" },
    sectionFortnite: { ES: "🎮 Fortnite",             EN: "🎮 Fortnite"             },
    sectionRoblox:   { ES: "🎮 Roblox",               EN: "🎮 Roblox"               },
    sectionGame:     { ES: "🎮 Datos del juego",      EN: "🎮 Game Details"         },
    sectionDiscord:  { ES: "💬 Discord",              EN: "💬 Discord"              },
  },

  /* ══════════════════════════════════════════
     ORDER SUCCESS
  ══════════════════════════════════════════ */
  orderSuccess: {
    title:       { ES: "¡Pedido Confirmado!",          EN: "Order Confirmed!"         },
    subtitle:    { ES: "Tu pedido fue registrado correctamente. Para continuar, envíanos el comprobante por WhatsApp.", EN: "Your order was registered successfully. To proceed, send us the receipt via WhatsApp." },
    totalLabel:  { ES: "Total:",                       EN: "Total:"                   },
    methodLabel: { ES: "Método de pago:",              EN: "Payment method:"          },
    products:    { ES: "Productos:",                   EN: "Products:"                },
    whatsapp:    { ES: "Enviar comprobante por WhatsApp", EN: "Send receipt via WhatsApp" },
    back:        { ES: "Volver al catálogo",           EN: "Back to catalog"          },
  },

  /* ══════════════════════════════════════════
     FOOTER
  ══════════════════════════════════════════ */
  footer: {
    tagline:    { ES: "Tu tienda digital gamer de confianza. Seguridad, rapidez y atención personalizada en cada compra.", EN: "Your trusted digital gaming store. Security, speed and personalized service on every purchase." },
    schedule:   { ES: "Horario de Atención",  EN: "Business Hours"   },
    weekdays:   { ES: "Lunes a Viernes: 9:00 AM – 12:00 AM",    EN: "Monday to Friday: 9:00 AM – 12:00 AM"   },
    weekends:   { ES: "Sábados y Domingos: 2:00 PM – 12:00 AM", EN: "Saturdays & Sundays: 2:00 PM – 12:00 AM" },
    terms:      { ES: "Términos y Condiciones", EN: "Terms & Conditions" },
    rights:     { ES: "Todos los derechos reservados.", EN: "All rights reserved." },
  },

  /* ══════════════════════════════════════════
     ACCOUNT
  ══════════════════════════════════════════ */
  account: {
    title:        { ES: "Mi Cuenta",              EN: "My Account"           },
    profile:      { ES: "Información de Perfil",  EN: "Profile Information"  },
    userLabel:    { ES: "Usuario:",               EN: "Username:"            },
    emailLabel:   { ES: "Correo:",                EN: "Email:"               },
    logout:       { ES: "Cerrar sesión",          EN: "Log out"              },
    options:      { ES: "Opciones",               EN: "Options"              },
    orders:       { ES: "📦 Historial de órdenes (próximamente)", EN: "📦 Order history (coming soon)" },
    security:     { ES: "🔐 Seguridad de la cuenta (próximamente)", EN: "🔐 Account security (coming soon)" },
    preferences:  { ES: "⚙️ Preferencias (próximamente)", EN: "⚙️ Preferences (coming soon)" },
    login:        { ES: "Iniciar Sesión",         EN: "Log In"               },
    register:     { ES: "Crear Cuenta",           EN: "Create Account"       },
    username:     { ES: "Usuario",                EN: "Username"             },
    password:     { ES: "Contraseña",             EN: "Password"             },
    userOrEmail:  { ES: "Usuario o correo",       EN: "Username or email"    },
    enter:        { ES: "Entrar",                 EN: "Sign in"              },
    entering:     { ES: "Ingresando...",           EN: "Signing in..."        },
    noAccount:    { ES: "¿No tienes cuenta?",     EN: "Don't have an account?" },
    signUp:       { ES: "Regístrate",             EN: "Sign up"              },
    haveAccount:  { ES: "¿Ya tienes cuenta?",     EN: "Already have an account?" },
    signIn:       { ES: "Inicia sesión",          EN: "Sign in"              },
    creating:     { ES: "Creando cuenta...",      EN: "Creating account..."  },
    created:      { ES: "🎉 Cuenta creada correctamente", EN: "🎉 Account created successfully" },
    sentEmail:    { ES: "📩 Se envió un correo de bienvenida a", EN: "📩 A welcome email was sent to" },
    redirecting:  { ES: "Redirigiendo automáticamente...", EN: "Redirecting automatically..." },
    wrongCredentials: { ES: "Usuario o contraseña incorrectos", EN: "Incorrect username or password" },
    fillAll:      { ES: "Completa todos los campos", EN: "Please fill in all fields" },
    userExists:   { ES: "El usuario o correo ya existe", EN: "Username or email already exists" },
    registerMe:   { ES: "Registrarme",            EN: "Register"             },
  },

  /* ══════════════════════════════════════════
     CATEGORY SHELLS — subtítulos genéricos
  ══════════════════════════════════════════ */
  categories: {
    addToCart:       { ES: "Agregar al carrito",  EN: "Add to cart"          },
    priceNote:       { ES: "Moneda configurable desde el encabezado", EN: "Currency configurable from the header" },
    pricesIn:        { ES: "Precios en",          EN: "Prices in"            },
    imageHere:       { ES: "Imagen aquí",         EN: "Image here"           },
    deliveryFast:    { ES: "⚡ Entrega rápida según disponibilidad.", EN: "⚡ Fast delivery subject to availability." },
  },

  /* ══════════════════════════════════════════
     PAYMENT METHODS
  ══════════════════════════════════════════ */
  payment: {
    yape:           { ES: "Pago con Yape",         EN: "Pay with Yape"       },
    plin:           { ES: "Pago con Plin",         EN: "Pay with Plin"       },
    transfer:       { ES: "Transferencia Bancaria",EN: "Bank Transfer"       },
    binance:        { ES: "Binance Pay",           EN: "Binance Pay"         },
    number:         { ES: "Número:",               EN: "Number:"             },
    name:           { ES: "Nombre:",               EN: "Name:"               },
    scanQr:         { ES: "Escanea el QR o usa el ID Pay para completar el pago.", EN: "Scan the QR or use the Pay ID to complete payment." },
    sendReceipt:    { ES: "Envía el pago y adjunta el comprobante al finalizar.", EN: "Send the payment and attach the receipt when done." },
    payId:          { ES: "ID Pay:",               EN: "Pay ID:"             },
    holder:         { ES: "Titular:",              EN: "Account holder:"     },
    doTransfer:     { ES: "Realiza la transferencia y adjunta el comprobante.", EN: "Complete the transfer and attach the receipt." },
    methodYape:     { ES: "Yape",                  EN: "Yape"                },
    methodPlin:     { ES: "Plin",                  EN: "Plin"                },
    methodTransfer: { ES: "Transferencia bancaria",EN: "Bank transfer"       },
    methodBinance:  { ES: "Binance Pay",           EN: "Binance Pay"        },
    descYape:       { ES: "Pago inmediato desde tu celular",    EN: "Instant payment from your phone"     },
    descPlin:       { ES: "Transferencia rápida entre bancos",  EN: "Fast transfer between banks"         },
    descTransfer:   { ES: "BCP / Interbank / BBVA",             EN: "BCP / Interbank / BBVA"              },
    descBinance:    { ES: "Criptomonedas (USDT)",               EN: "Cryptocurrency (USDT)"               },
  },

  /* ══════════════════════════════════════════
     TERMS
  ══════════════════════════════════════════ */
  terms: {
    title:  { ES: "Términos y Condiciones",  EN: "Terms & Conditions" },
    intro:  { ES: "Al realizar una compra en KidStore Perú aceptas los siguientes términos:", EN: "By making a purchase at KidStore Perú you accept the following terms:" },
    t1:     { ES: "Todos los productos digitales no tienen devolución una vez entregados.",   EN: "All digital products are non-refundable once delivered." },
    t2:     { ES: "El cliente es responsable de proporcionar datos correctos.",               EN: "The customer is responsible for providing correct information." },
    t3:     { ES: "Los tiempos de entrega pueden variar según la plataforma.",                EN: "Delivery times may vary depending on the platform." },
    t4:     { ES: "No nos hacemos responsables por bloqueos o restricciones externas de plataformas.", EN: "We are not responsible for bans or external platform restrictions." },
    t5:     { ES: "Las compras fraudulentas serán reportadas.",                               EN: "Fraudulent purchases will be reported." },
  },

} as const;

export type TranslationKey = keyof typeof translations;