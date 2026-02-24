// src/i18n/translations.ts
export type Lang = "ES" | "EN";

export const translations = {

  /* ══════════════════════════════════════════ HEADER ══ */
  header: {
    myAccount: { ES: "Mi Cuenta",  EN: "My Account" },
    cart:      { ES: "Carrito",    EN: "Cart"        },
  },

  /* ══════════════════════════════════════════ HOME ══ */
  home: {
    heroTitle:    { ES: "CATÁLOGO",        EN: "CATALOG"       },
    heroSpan:     { ES: "DIGITAL",   EN: "DIGITAL" },
    heroSubtitle: {
      ES: "Elige tu juego favorito y compra de forma rápida, segura y sin complicaciones.",
      EN: "Choose your favorite game and buy quickly, safely, and hassle-free.",
    },
  },

  /* ══════════════════════════════════════════ CART ══ */
  cart: {
    title:    { ES: "Tu Carrito",                              EN: "Your Cart"                        },
    empty:    { ES: "Tu carrito está vacío",                   EN: "Your cart is empty"               },
    emptyHint:{ ES: "Agrega productos para comenzar tu compra",EN: "Add products to start shopping"   },
    total:    { ES: "Total:",                                  EN: "Total:"                           },
    checkout: { ES: "Proceder al Pago",                        EN: "Proceed to Checkout"              },
    clear:    { ES: "Vaciar carrito",                          EN: "Clear cart"                       },
    close:    { ES: "Cerrar carrito",                          EN: "Close cart"                       },
    decrease: { ES: "Disminuir cantidad",                      EN: "Decrease quantity"                },
    increase: { ES: "Aumentar cantidad",                       EN: "Increase quantity"                },
    remove:   { ES: "Eliminar producto",                       EN: "Remove product"                   },
  },

  /* ══════════════════════════════════════════ CHECKOUT ══ */
  checkout: {
    title:           { ES: "Datos del cliente",                EN: "Customer Details"                },
    summary:         { ES: "Resumen de compra",                EN: "Order Summary"                   },
    quantity:        { ES: "Cantidad:",                        EN: "Quantity:"                       },
    total:           { ES: "Total",                            EN: "Total"                           },
    emptyCart:       { ES: "Tu carrito está vacío",            EN: "Your cart is empty"              },
    backCatalog:     { ES: "Volver al catálogo",               EN: "Back to catalog"                 },
    name:            { ES: "Nombre completo",                  EN: "Full name"                       },
    email:           { ES: "Correo electrónico",               EN: "Email address"                   },
    epicUser:        { ES: "Usuario de Epic Games",            EN: "Epic Games username"             },
    uid:             { ES: "UID del jugador",                  EN: "Player UID"                      },
    selectServer:    { ES: "Selecciona tu servidor",           EN: "Select your server"              },
    gamePassLink:    { ES: "Enlace de tu Game Pass",           EN: "Your Game Pass link"             },
    discordType:     { ES: "Tipo de producto Discord",         EN: "Discord product type"            },
    discordNitro:    { ES: "Discord Nitro",                    EN: "Discord Nitro"                   },
    discordBoost:    { ES: "Mejoras de servidor",              EN: "Server Boosts"                   },
    discordDeco:     { ES: "Decoraciones / Placas",            EN: "Decorations / Badges"            },
    paymentMethod:   { ES: "Método de pago",                   EN: "Payment method"                  },
    notes:           { ES: "Notas o instrucciones adicionales (opcional)", EN: "Additional notes (optional)" },
    confirm:         { ES: "Confirmar compra",                 EN: "Confirm purchase"                },
    processing:      { ES: "Procesando...",                    EN: "Processing..."                   },
    terms:           { ES: "Al confirmar, aceptas nuestros términos y condiciones.", EN: "By confirming, you accept our terms and conditions." },
    selectPayment:   { ES: "Selecciona un método de pago",     EN: "Select a payment method"         },
    sectionFortnite: { ES: "🎮 Fortnite",                      EN: "🎮 Fortnite"                      },
    sectionRoblox:   { ES: "🎮 Roblox",                        EN: "🎮 Roblox"                        },
    sectionGame:     { ES: "🎮 Datos del juego",               EN: "🎮 Game Details"                  },
    sectionDiscord:  { ES: "💬 Discord",                       EN: "💬 Discord"                       },
  },

  /* ══════════════════════════════════════════ ORDER SUCCESS ══ */
  orderSuccess: {
    title:       { ES: "¡Pedido Confirmado!",                  EN: "Order Confirmed!"                },
    subtitle:    { ES: "Tu pedido fue registrado correctamente. Para continuar, envíanos el comprobante por WhatsApp.", EN: "Your order was registered successfully. To proceed, send us the receipt via WhatsApp." },
    totalLabel:  { ES: "Total:",                               EN: "Total:"                          },
    methodLabel: { ES: "Método de pago:",                      EN: "Payment method:"                 },
    products:    { ES: "Productos:",                           EN: "Products:"                       },
    whatsapp:    { ES: "Enviar comprobante por WhatsApp",       EN: "Send receipt via WhatsApp"       },
    back:        { ES: "Volver al catálogo",                   EN: "Back to catalog"                 },
  },

  /* ══════════════════════════════════════════ FOOTER ══ */
  footer: {
    tagline:  { ES: "Tu tienda digital gamer de confianza. Seguridad, rapidez y atención personalizada en cada compra.", EN: "Your trusted digital gaming store. Security, speed and personalized service on every purchase." },
    schedule: { ES: "Horario de Atención",                     EN: "Business Hours"                  },
    weekdays: { ES: "Lunes a Viernes: 9:00 AM – 12:00 AM",    EN: "Monday to Friday: 9:00 AM – 12:00 AM"   },
    weekends: { ES: "Sábados y Domingos: 2:00 PM – 12:00 AM", EN: "Saturdays & Sundays: 2:00 PM – 12:00 AM" },
    terms:    { ES: "Términos y Condiciones",                  EN: "Terms & Conditions"              },
    rights:   { ES: "Todos los derechos reservados.",          EN: "All rights reserved."            },
  },

  /* ══════════════════════════════════════════ ACCOUNT ══ */
  account: {
    title:            { ES: "Mi Cuenta",                       EN: "My Account"                      },
    profile:          { ES: "Información de Perfil",           EN: "Profile Information"             },
    userLabel:        { ES: "Usuario:",                        EN: "Username:"                       },
    emailLabel:       { ES: "Correo:",                         EN: "Email:"                          },
    logout:           { ES: "Cerrar sesión",                   EN: "Log out"                         },
    options:          { ES: "Opciones",                        EN: "Options"                         },
    orders:           { ES: "📦 Historial de órdenes (próximamente)", EN: "📦 Order history (coming soon)" },
    security:         { ES: "🔐 Seguridad de la cuenta (próximamente)", EN: "🔐 Account security (coming soon)" },
    preferences:      { ES: "⚙️ Preferencias (próximamente)", EN: "⚙️ Preferences (coming soon)"    },
    login:            { ES: "Iniciar Sesión",                  EN: "Log In"                          },
    register:         { ES: "Crear Cuenta",                    EN: "Create Account"                  },
    username:         { ES: "Usuario",                         EN: "Username"                        },
    password:         { ES: "Contraseña",                      EN: "Password"                        },
    userOrEmail:      { ES: "Usuario o correo",                EN: "Username or email"               },
    enter:            { ES: "Entrar",                          EN: "Sign in"                         },
    entering:         { ES: "Ingresando...",                   EN: "Signing in..."                   },
    noAccount:        { ES: "¿No tienes cuenta?",              EN: "Don't have an account?"          },
    signUp:           { ES: "Regístrate",                      EN: "Sign up"                         },
    haveAccount:      { ES: "¿Ya tienes cuenta?",              EN: "Already have an account?"        },
    signIn:           { ES: "Inicia sesión",                   EN: "Sign in"                         },
    creating:         { ES: "Creando cuenta...",               EN: "Creating account..."             },
    created:          { ES: "🎉 Cuenta creada correctamente",  EN: "🎉 Account created successfully" },
    sentEmail:        { ES: "📩 Se envió un correo de bienvenida a", EN: "📩 A welcome email was sent to" },
    redirecting:      { ES: "Redirigiendo automáticamente...", EN: "Redirecting automatically..."    },
    wrongCredentials: { ES: "Usuario o contraseña incorrectos",EN: "Incorrect username or password"  },
    fillAll:          { ES: "Completa todos los campos",       EN: "Please fill in all fields"       },
    userExists:       { ES: "El usuario o correo ya existe",   EN: "Username or email already exists"},
    registerMe:       { ES: "Registrarme",                     EN: "Register"                        },
  },

  /* ══════════════════════════════════════════ SHARED PRODUCT UI ══ */
  product: {
    addToCart:   { ES: "Agregar al carrito",   EN: "Add to cart"       },
    imageHere:   { ES: "Imagen aquí",          EN: "Image here"        },
    pricesIn:    { ES: "Precios en",           EN: "Prices in"         },
    currencyNote:{ ES: "Moneda configurable desde el encabezado", EN: "Currency configurable from the header" },
  },

  /* ══════════════════════════════════════════ PAYMENT ══ */
  payment: {
    yape:           { ES: "Pago con Yape",          EN: "Pay with Yape"              },
    plin:           { ES: "Pago con Plin",          EN: "Pay with Plin"              },
    transfer:       { ES: "Transferencia Bancaria", EN: "Bank Transfer"              },
    binance:        { ES: "Binance Pay",            EN: "Binance Pay"                },
    number:         { ES: "Número:",               EN: "Number:"                    },
    name:           { ES: "Nombre:",               EN: "Name:"                      },
    scanQr:         { ES: "Escanea el QR o usa el ID Pay para completar el pago.", EN: "Scan the QR or use the Pay ID to complete payment." },
    sendReceipt:    { ES: "Envía el pago y adjunta el comprobante al finalizar.", EN: "Send the payment and attach the receipt when done." },
    payId:          { ES: "ID Pay:",               EN: "Pay ID:"                    },
    holder:         { ES: "Titular:",              EN: "Account holder:"             },
    doTransfer:     { ES: "Realiza la transferencia y adjunta el comprobante.", EN: "Complete the transfer and attach the receipt." },
    methodYape:     { ES: "Yape",                  EN: "Yape"                        },
    methodPlin:     { ES: "Plin",                  EN: "Plin"                        },
    methodTransfer: { ES: "Transferencia bancaria",EN: "Bank transfer"               },
    methodBinance:  { ES: "Binance Pay",           EN: "Binance Pay"                 },
    descYape:       { ES: "Pago inmediato desde tu celular",   EN: "Instant payment from your phone" },
    descPlin:       { ES: "Transferencia rápida entre bancos", EN: "Fast transfer between banks"      },
    descTransfer:   { ES: "BCP / Interbank / BBVA",            EN: "BCP / Interbank / BBVA"           },
    descBinance:    { ES: "Criptomonedas (USDT)",              EN: "Cryptocurrency (USDT)"            },
  },

  /* ══════════════════════════════════════════ TERMS ══ */
  terms: {
    title: { ES: "Términos y Condiciones", EN: "Terms & Conditions" },
    intro: { ES: "Al realizar una compra en KidStore Perú aceptas los siguientes términos:", EN: "By making a purchase at KidStore Perú you accept the following terms:" },
    t1:    { ES: "Todos los productos digitales no tienen devolución una vez entregados.",   EN: "All digital products are non-refundable once delivered."              },
    t2:    { ES: "El cliente es responsable de proporcionar datos correctos.",               EN: "The customer is responsible for providing correct information."       },
    t3:    { ES: "Los tiempos de entrega pueden variar según la plataforma.",               EN: "Delivery times may vary depending on the platform."                  },
    t4:    { ES: "No nos hacemos responsables por bloqueos o restricciones externas de plataformas.", EN: "We are not responsible for bans or external platform restrictions." },
    t5:    { ES: "Las compras fraudulentas serán reportadas.",                              EN: "Fraudulent purchases will be reported."                              },
  },

  /* ══════════════════════════════════════════ WILD RIFT ══ */
  wildrift: {
    subtitle:  { ES: "Compra Wild Cores para cuentas de League of Legends: Wild Rift en regiones LAN y LAS de forma rápida y segura.", EN: "Buy Wild Cores for League of Legends: Wild Rift accounts in LAN and LAS regions quickly and safely." },
  },

  /* ══════════════════════════════════════════ GENSHIN ══ */
  genshin: {
    subtitle:  { ES: "Cristales Génesis oficiales – Entrega segura y confiable", EN: "Official Genesis Crystals – Safe and reliable delivery" },
    infoTitle: { ES: "📋 Datos requeridos para realizar el pedido:", EN: "📋 Required information for your order:" },
    i1:        { ES: "🧾 Cuenta",           EN: "🧾 Account"               },
    i2:        { ES: "🔒 Contraseña",       EN: "🔒 Password"              },
    i3:        { ES: "🔑 Método de inicio de sesión (Gmail / Facebook / Email / X)", EN: "🔑 Login method (Gmail / Facebook / Email / X)" },
    i4:        { ES: "🆔 Nombre del jugador / UID", EN: "🆔 Player name / UID" },
    i5:        { ES: "🌍 Servidor",         EN: "🌍 Server"                },
    bonus:     { ES: "✨ Bonus x2 de Cristales Génesis disponible si es tu primera recarga.", EN: "✨ x2 Genesis Crystal bonus available on your first top-up." },
  },

  /* ══════════════════════════════════════════ HONKAI ══ */
  honkai: {
    subtitle:  { ES: "Recargas oficiales – Entrega segura por UID", EN: "Official top-ups – Safe delivery via UID" },
    infoTitle: { ES: "📜 Datos necesarios para la recarga:", EN: "📜 Required data for top-up:" },
    i1:        { ES: "🆔 UID del jugador",  EN: "🆔 Player UID"            },
    i2:        { ES: "🌐 Servidor",         EN: "🌐 Server"                },
    bonus:     { ES: "✨ BONUS x2 disponible para cuentas que nunca hayan recargado.", EN: "✨ x2 BONUS available for accounts that have never topped up." },
    noBonus:   { ES: "🔁 Si la cuenta ya ha recargado anteriormente, solo se aplicará el bono indicado.", EN: "🔁 If the account has topped up before, only the indicated bonus applies." },
    safe:      { ES: "🔒 No se requiere cuenta ni contraseña. Recarga 100% segura.", EN: "🔒 No account or password required. 100% safe top-up." },
  },

  /* ══════════════════════════════════════════ HONOR OF KINGS ══ */
  honor: {
    subtitle:  { ES: "Recarga de Tokens – Android y iOS", EN: "Token Top-Up – Android & iOS" },
    infoTitle: { ES: "📋 Datos necesarios para la recarga:", EN: "📋 Data required for top-up:" },
    i1:        { ES: "🌍 Plataforma: Android / iOS",  EN: "🌍 Platform: Android / iOS" },
    i2:        { ES: "🆔 ID de Usuario",              EN: "🆔 User ID"                 },
    i3:        { ES: "🎮 Nombre del personaje",       EN: "🎮 Character name"          },
    fast:      { ES: "⚡ Entrega rápida y segura directamente en tu cuenta.", EN: "⚡ Fast and secure delivery directly to your account." },
    safe:      { ES: "🛡️ No se requiere contraseña. Proceso 100% confiable.", EN: "🛡️ No password required. 100% reliable process." },
  },

  /* ══════════════════════════════════════════ MARVEL RIVALS ══ */
  marvel: {
    subtitle:  { ES: "Recarga LATICES de Marvel Rivals de forma rápida y segura. Entrega inmediata mediante ID de jugador.", EN: "Top up Marvel Rivals LATTICE quickly and safely. Instant delivery via player ID." },
    tip1:      { ES: "🎮 Perfecto para mejorar tu experiencia en el juego.", EN: "🎮 Perfect for enhancing your in-game experience." },
    tip2:      { ES: "💳 Entrega rápida vía ID de jugador (solo necesitas tu ID).", EN: "💳 Fast delivery via player ID (you only need your ID)." },
  },

  /* ══════════════════════════════════════════ POKÉMON GO ══ */
  pokemon: {
    subtitle:  { ES: "Pokémonedas y entradas oficiales – Entrega rápida y segura", EN: "PokéCoins & official tickets – Fast and secure delivery" },
    delivery:  { ES: "⚡ Entrega rápida según disponibilidad.", EN: "⚡ Fast delivery subject to availability." },
    disclaimer:{ ES: "🛡️ No nos responsabilizamos por el estado o seguridad de la cuenta del jugador.", EN: "🛡️ We are not responsible for the player's account status or security." },
  },

  /* ══════════════════════════════════════════ ROBLOX ══ */
  roblox: {
    subtitle:       { ES: "Compra Robux de forma segura y rápida. Entrega inmediata o mediante Game Pass, nosotros cubrimos el tax para que recibas el monto exacto.", EN: "Buy Robux safely and quickly. Immediate delivery or via Game Pass — we cover the tax so you receive the exact amount." },
    sectionDirect:  { ES: "Robux Disponibles – Entrega Inmediata ⚡", EN: "Available Robux – Instant Delivery ⚡" },
    sectionGP:      { ES: "Robux por Game Pass 💸",                   EN: "Robux via Game Pass 💸"              },
    gpInfo:         { ES: "Nosotros cubrimos el tax de Roblox (30%). Recibirás la cantidad exacta de Robux. Debes enviarnos el enlace de tu Game Pass creado con el precio correcto.", EN: "We cover the Roblox tax (30%). You will receive the exact amount of Robux. Send us your Game Pass link created at the correct price." },
    deliveryTime:   { ES: "⏱ Tiempo de entrega estimado: entre 1h a 7h, según disponibilidad.", EN: "⏱ Estimated delivery time: 1h to 7h, subject to availability." },
    gpDays:         { ES: "✔ El pago se procesa entre 5 a 7 días luego de la compra.", EN: "✔ Payment is processed within 5 to 7 days after purchase." },
    gpNoRefund:     { ES: "❌ No hay reembolsos luego de comprar un Game Pass.",        EN: "❌ No refunds after purchasing a Game Pass."                },
    gpDisclaimer:   { ES: "🛡 No nos responsabilizamos por el estado o seguridad de la cuenta.", EN: "🛡 We are not responsible for the account's status or security." },
  },

  /* ══════════════════════════════════════════ WUTHERING WAVES ══ */
  wuwa: {
    subtitle:  { ES: "Recargas de Lunita – Entrega segura y confiable", EN: "Lunite Top-Ups – Safe and reliable delivery" },
    infoTitle: { ES: "📋 Datos requeridos para la recarga:", EN: "📋 Required data for top-up:" },
    i1:        { ES: "🧾 Cuenta",         EN: "🧾 Account"                },
    i2:        { ES: "🔒 Contraseña",     EN: "🔒 Password"               },
    i3:        { ES: "🔑 Método de inicio de sesión (Gmail / Facebook / Email / X / Kuro)", EN: "🔑 Login method (Gmail / Facebook / Email / X / Kuro)" },
    i4:        { ES: "🆔 UID / Nombre del jugador", EN: "🆔 UID / Player name" },
    i5:        { ES: "🌍 Servidor",       EN: "🌍 Server"                 },
    bonus:     { ES: "✨ BONUS x2 Lunita disponible para cuentas que nunca hayan recargado.", EN: "✨ x2 Lunite BONUS available for first-time top-up accounts." },
    noBonus:   { ES: "🔁 Si ya recargaste anteriormente, solo se aplicará el bono indicado.", EN: "🔁 If you've topped up before, only the indicated bonus applies." },
    safe:      { ES: "🛡️ Recarga realizada de forma segura por nuestro equipo.", EN: "🛡️ Top-up performed safely by our team." },
  },

  /* ══════════════════════════════════════════ ZENLESS ZONE ZERO ══ */
  zzz: {
    subtitle:  { ES: "Recargas oficiales – Entrega segura y rápida", EN: "Official top-ups – Safe and fast delivery" },
    infoTitle: { ES: "🔐 Datos necesarios para la recarga:", EN: "🔐 Required data for top-up:" },
    i1:        { ES: "🆔 UID del jugador", EN: "🆔 Player UID" },
    i2:        { ES: "🌐 Servidor",        EN: "🌐 Server"     },
    safe:      { ES: "💫 Las recargas se realizan de forma segura directamente en la cuenta del jugador.", EN: "💫 Top-ups are performed safely directly on the player's account." },
  },

  /* ══════════════════════════════════════════ DISCORD ══ */
  discord: {
    subtitle:    { ES: "Nitro, Boosts y Personalización de Perfil", EN: "Nitro, Boosts & Profile Customization" },
    nitroFree:   { ES: "Disponible con Nitro activo",               EN: "Available with active Nitro"           },
    infoTitle:   { ES: "📌 Información importante:",                EN: "📌 Important information:"              },
    i1:          { ES: "🔐 Algunos productos requieren acceso temporal a la cuenta.", EN: "🔐 Some products require temporary account access." },
    i2:          { ES: "🆕 El Nitro para nuevos usuarios solo funciona si la cuenta nunca tuvo Nitro.", EN: "🆕 New user Nitro only works if the account has never had Nitro." },
    i3:          { ES: "🚀 Entrega rápida y soporte durante todo el proceso.", EN: "🚀 Fast delivery and support throughout the process." },
    i4:          { ES: "🎨 Decoraciones y efectos disponibles solo para cuentas con Nitro activo.", EN: "🎨 Decorations and effects available only for accounts with active Nitro." },
    noRefund:    { ES: "⚠️ No hay reembolsos una vez aplicado el servicio.", EN: "⚠️ No refunds once the service has been applied." },
    // product names
    nitroMonthly:{ ES: "Discord Nitro Mensual",         EN: "Discord Nitro Monthly"      },
    nitroYearly: { ES: "Discord Nitro Anual",           EN: "Discord Nitro Yearly"       },
    nitro3m:     { ES: "Discord Nitro 3 Meses",         EN: "Discord Nitro 3 Months"     },
    boost2x:     { ES: "Mejoras de Servidor x2 (3 Meses)", EN: "Server Boosts x2 (3 Months)" },
    deco:        { ES: "Decoraciones y Efectos",        EN: "Decorations & Effects"      },
    descMonthly: { ES: "Con acceso a cuenta",           EN: "With account access"        },
    descYearly:  { ES: "Con acceso a cuenta",           EN: "With account access"        },
    desc3m:      { ES: "Solo para cuentas que nunca tuvieron Nitro", EN: "Only for accounts that never had Nitro" },
    descBoost:   { ES: "Server Boosts",                 EN: "Server Boosts"              },
    descDeco:    { ES: "50% de descuento en decoraciones, efectos de perfil, placas y lotes", EN: "50% off decorations, profile effects, badges and bundles" },
  },

  /* ══════════════════════════════════════════ FORTNITE ══ */
  fortnite: {
    subtitle: { ES: "Objetos disponibles hoy",        EN: "Items available today"       },
    loading:  { ES: "Cargando tienda en tiempo real...", EN: "Loading live shop..."     },
  },

} as const;

export type TranslationKey = keyof typeof translations;