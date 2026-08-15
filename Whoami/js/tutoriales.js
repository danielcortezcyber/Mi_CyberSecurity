// js/tutoriales.js (COMPLETO CON TODOS LOS TUTORIALES)
(function() {
  "use strict";

  var TUTORIALES = [
    // ======================== REDES / CISCO ========================
    {
      id: "vlan-cisco",
      title: "Configuración de VLAN en Cisco IOS",
      cat: "cisco",
      catLabel: "Redes / Cisco",
      date: "2026-07-20",
      duration: "18:42",
      level: "Intermedio",
      type: "tutorial",
      desc: "Segmenta tu red por departamentos y enruta entre VLAN con router-on-a-stick. Topología descargable incluida.",
      art: "topo",
      preview: [
        [{ t: "Switch> ", c: "p" }, { t: "enable", c: "b" }],
        [{ t: "Switch# ", c: "p" }, { t: "configure terminal", c: "b" }],
        [{ t: "Switch(config)# ", c: "p" }, { t: "vlan 10", c: "" }],
        [{ t: "Switch(config-vlan)# ", c: "p" }, { t: "name INGENIERIA", c: "o" }],
        [{ t: "! asignando puertos de acceso", c: "c" }],
        [{ t: "Switch(config)# ", c: "p" }, { t: "interface fa0/10", c: "" }],
        [{ t: "Switch(config-if)# ", c: "p" }, { t: "switchport mode access", c: "" }],
        [{ t: "Switch(config-if)# ", c: "p" }, { t: "switchport access vlan 10", c: "o" }],
        [{ t: "% VLAN 10 creada y asignada.", c: "o" }]
      ],
      steps: [
        { h: "1. Crear la VLAN", p: "Desde el modo de configuración global, crea la VLAN con su ID y nombre descriptivo." },
        { h: "2. Asignar puertos de acceso", p: "Configura el puerto que conecta al host en modo access y asígnalo a la VLAN." },
        { h: "3. Configurar enlace trunk", p: "Si hay varios switches, configura el puerto de interconexión como trunk para transportar las VLANs." },
        { h: "4. Router-on-a-stick", p: "Crea subinterfaces en el router con encapsulación dot1Q para enrutar entre VLANs." }
      ],
      code: [
        {
          head: "Switch# configure terminal",
          lines: [
            { t: "vlan 10", c: "" }, { t: "  name INGENIERIA", c: "o" },
            { t: "exit", c: "c" },
            { t: "interface fastEthernet 0/10", c: "" },
            { t: "  switchport mode access", c: "" },
            { t: "  switchport access vlan 10", c: "o" },
            { t: "interface gigabitEthernet 0/1", c: "" },
            { t: "  switchport mode trunk", c: "o" },
            { t: "  switchport trunk allowed vlan 10,20", c: "o" }
          ]
        },
        {
          head: "Router (router-on-a-stick)",
          lines: [
            { t: "interface gigabitEthernet 0/0.10", c: "" },
            { t: "  encapsulation dot1Q 10", c: "o" },
            { t: "  ip address 192.168.10.1 255.255.255.0", c: "b" }
          ]
        }
      ],
      repo: "https://github.com/danielcortez/vlan-lab",
      demo: "#casos"
    },
    {
      id: "ospf-basico",
      title: "Enrutamiento Dinámico con OSPF",
      cat: "cisco",
      catLabel: "Redes / Cisco",
      date: "2026-06-22",
      duration: "19:55",
      level: "Avanzado",
      type: "tutorial",
      desc: "Configura OSPF multi-área y observa cómo convergen las rutas automáticamente.",
      art: "topo",
      preview: [
        [{ t: "R1(config)# ", c: "p" }, { t: "router ospf 1", c: "b" }],
        [{ t: "R1(config-router)# ", c: "p" }, { t: "network 10.0.0.0 0.255.255.255 area 0", c: "o" }],
        [{ t: "%OSPF-5-ADJCHG: adyacencia con 10.0.0.2 en FULL", c: "o" }],
        [{ t: "R1# ", c: "p" }, { t: "show ip route ospf", c: "b" }],
        [{ t: "O   192.168.10.0/24 [110/2] via 10.0.0.2", c: "o" }]
      ],
      steps: [
        { h: "1. Habilitar OSPF", p: "Configura el proceso OSPF con un ID de proceso (por ejemplo, 1)." },
        { h: "2. Anunciar redes", p: "Asocia las redes al área correspondiente (generalmente área 0)." },
        { h: "3. Verificar vecinos", p: "Comprueba que los routers vecinos establezcan adyacencia." },
        { h: "4. Verificar rutas", p: "Observa las rutas aprendidas y la convergencia." }
      ],
      code: [
        {
          head: "R1# configure terminal",
          lines: [
            { t: "router ospf 1", c: "b" },
            { t: "  network 10.0.0.0 0.255.255.255 area 0", c: "o" },
            { t: "  network 192.168.1.0 0.0.0.255 area 0", c: "o" },
            { t: "exit", c: "c" }
          ]
        },
        {
          head: "Verificación",
          lines: [
            { t: "show ip ospf neighbor", c: "p" },
            { t: "Neighbor ID   State   Dead Time", c: "c" },
            { t: "10.0.0.2      FULL    00:00:35", c: "o" },
            { t: "show ip route ospf", c: "p" },
            { t: "O   192.168.2.0/24 [110/2] via 10.0.0.2", c: "o" }
          ]
        }
      ],
      repo: "https://github.com/danielcortez/ospf-lab",
      demo: null
    },
    {
      id: "acl-cisco",
      title: "Listas de Control de Acceso (ACL) en Cisco",
      cat: "cisco",
      catLabel: "Redes / Cisco",
      date: "2026-05-26",
      duration: "15:51",
      level: "Intermedio",
      type: "proyecto",
      desc: "Filtra tráfico por reglas con ACL extendidas: permite HTTP, bloquea el resto.",
      art: "topo",
      preview: [
        [{ t: "R1(config)# ", c: "p" }, { t: "access-list 110 permit tcp any any eq 80", c: "o" }],
        [{ t: "R1(config)# ", c: "p" }, { t: "access-list 110 deny ip any any", c: "e" }],
        [{ t: "R1(config)# ", c: "p" }, { t: "interface g0/0", c: "" }],
        [{ t: "R1(config-if)# ", c: "p" }, { t: "ip access-group 110 in", c: "o" }],
        [{ t: "% ACL 110 aplicada — solo HTTP permitido", c: "o" }]
      ],
      steps: [
        { h: "1. Definir la ACL extendida", p: "Crea una ACL con número 110 que permita tráfico TCP al puerto 80." },
        { h: "2. Denegar el resto", p: "Añade una regla de denegación para todo lo demás." },
        { h: "3. Aplicar a la interfaz", p: "Asigna la ACL a la interfaz de entrada o salida." },
        { h: "4. Verificar", p: "Comprueba que la ACL filtra correctamente el tráfico." }
      ],
      code: [
        {
          head: "R1# configure terminal",
          lines: [
            { t: "access-list 110 permit tcp any any eq 80", c: "o" },
            { t: "access-list 110 deny ip any any", c: "e" },
            { t: "interface gigabitEthernet 0/0", c: "" },
            { t: "  ip access-group 110 in", c: "o" },
            { t: "exit", c: "c" }
          ]
        }
      ],
      repo: null,
      demo: null
    },

    // ======================== CIBERSEGURIDAD ========================
    {
      id: "nmap-essentials",
      title: "Escaneo de Red con Nmap",
      cat: "cyber",
      catLabel: "Ciberseguridad",
      date: "2026-07-14",
      duration: "22:10",
      level: "Intermedio",
      type: "tutorial",
      desc: "Descubre puertos abiertos, servicios y sistemas operativos en tu red.",
      art: "shield",
      preview: [
        [{ t: "root@kali:~# ", c: "p" }, { t: "nmap -sV -p- 192.168.1.1", c: "b" }],
        [{ t: "Starting Nmap 7.94", c: "c" }],
        [{ t: "PORT     STATE SERVICE    VERSION", c: "c" }],
        [{ t: "22/tcp   open  ssh        OpenSSH 8.9p1", c: "o" }],
        [{ t: "80/tcp   open  http       Apache httpd 2.4.54", c: "o" }],
        [{ t: "443/tcp  open  https      nginx 1.22.0", c: "o" }],
        [{ t: "Nmap done: 1 IP address (1 host up)", c: "o" }]
      ],
      steps: [
        { h: "1. Escaneo básico de puertos", p: "Usa `nmap <IP>` para escanear los 1000 puertos más comunes." },
        { h: "2. Escaneo de servicios y versiones", p: "Con `-sV` obtén las versiones de los servicios detectados." },
        { h: "3. Escaneo de sistema operativo", p: "Con `-O` intenta identificar el sistema operativo." },
        { h: "4. Scripts NSE", p: "Usa `--script` para ejecutar scripts de auditoría." }
      ],
      code: [
        {
          head: "Escaneo completo de puertos y versiones",
          lines: [
            { t: "nmap -sV -p- 192.168.1.1", c: "p" },
            { t: "Starting Nmap 7.94", c: "c" },
            { t: "PORT     STATE SERVICE    VERSION", c: "c" },
            { t: "22/tcp   open  ssh        OpenSSH 8.9p1", c: "o" },
            { t: "80/tcp   open  http       Apache httpd 2.4.54", c: "o" }
          ]
        },
        {
          head: "Detección de sistema operativo",
          lines: [
            { t: "nmap -O 192.168.1.1", c: "p" },
            { t: "OS: Linux 5.4 (Ubuntu 20.04)", c: "o" }
          ]
        }
      ],
      repo: "https://github.com/danielcortez/nmap-cheatsheet",
      demo: null
    },
    {
      id: "wireshark-http",
      title: "Análisis de Tráfico con Wireshark",
      cat: "cyber",
      catLabel: "Ciberseguridad",
      date: "2026-05-19",
      duration: "20:04",
      level: "Intermedio",
      type: "proyecto",
      desc: "Captura y analiza paquetes HTTP para detectar credenciales en texto plano.",
      art: "shield",
      preview: [
        [{ t: "filter: ", c: "p" }, { t: "http.request.method == POST", c: "b" }],
        [{ t: "Frame 482: POST /login", c: "c" }],
        [{ t: "  Form item: user=admin", c: "o" }],
        [{ t: "  Form item: pass=S3cr3t123", c: "e" }],
        [{ t: "[!] Credencial en texto plano detectada", c: "e" }],
        [{ t: "Recomendación: forzar HTTPS/TLS", c: "o" }]
      ],
      steps: [
        { h: "1. Iniciar captura", p: "Selecciona la interfaz de red y empieza a capturar." },
        { h: "2. Aplicar filtro", p: "Usa `http.request.method == POST` para aislar solicitudes POST." },
        { h: "3. Inspeccionar payload", p: "Abre el paquete y examina los datos del formulario." },
        { h: "4. Recomendar mitigación", p: "Documenta el hallazgo y propone cifrado TLS." }
      ],
      code: [
        {
          head: "Filtro Wireshark",
          lines: [
            { t: "http.request.method == POST", c: "p" },
            { t: "Frame 482: POST /login HTTP/1.1", c: "c" },
            { t: "  Form item: user=admin", c: "o" },
            { t: "  Form item: pass=S3cr3t123", c: "e" }
          ]
        }
      ],
      repo: "https://github.com/danielcortez/wireshark-lab",
      demo: null
    },
    {
      id: "fail2ban-setup",
      title: "Protege tu SSH con Fail2ban",
      cat: "cyber",
      catLabel: "Ciberseguridad",
      date: "2026-06-09",
      duration: "12:47",
      level: "Intermedio",
      type: "tutorial",
      desc: "Bloquea automáticamente los bots de fuerza bruta contra SSH.",
      art: "shield",
      preview: [
        [{ t: "root@srv:~# ", c: "p" }, { t: "tail -f /var/log/auth.log", c: "b" }],
        [{ t: "Failed password from 51.83.x.x", c: "e" }],
        [{ t: "[fail2ban] BAN 51.83.x.x — 1h", c: "o" }]
      ],
      steps: [
        { h: "1. Instalar Fail2ban", p: "`sudo apt install fail2ban`" },
        { h: "2. Configurar jail.local", p: "Habilita la jail para SSH y define maxretry y bantime." },
        { h: "3. Reiniciar servicio", p: "`systemctl restart fail2ban`" },
        { h: "4. Monitorear bans", p: "Revisa `/var/log/fail2ban.log` para ver bloqueos." }
      ],
      code: [
        {
          head: "/etc/fail2ban/jail.local",
          lines: [
            { t: "[sshd]", c: "b" },
            { t: "enabled = true", c: "o" },
            { t: "maxretry = 3", c: "" },
            { t: "bantime = 3600", c: "" },
            { t: "findtime = 600", c: "" }
          ]
        }
      ],
      repo: "https://github.com/danielcortez/fail2ban-lab",
      demo: null
    },
    {
      id: "malware-removal",
      title: "Eliminación de Malware Paso a Paso",
      cat: "cyber",
      catLabel: "Ciberseguridad",
      date: "2026-07-14",
      duration: "22:10",
      level: "Avanzado",
      type: "tutorial",
      desc: "Detecta, aísla y erradica malware persistente. Desde el Modo Seguro hasta la limpieza del registro.",
      art: "shield",
      preview: [
        [{ t: "C:\\Users\\admin> ", c: "p" }, { t: "MalwareScanner --deep", c: "b" }],
        [{ t: "[*] Analizando procesos en ejecución...", c: "c" }],
        [{ t: "[!] Sospechoso: svchost32.exe  PID 4892", c: "e" }],
        [{ t: "[+] Archivo movido a cuarentena", c: "o" }],
        [{ t: "Sistema: LIMPIO", c: "o" }]
      ],
      steps: [
        { h: "1. Aislar el equipo", p: "Desconecta la red para evitar propagación." },
        { h: "2. Arrancar en Modo Seguro", p: "Inicia sin drivers de terceros." },
        { h: "3. Cazar persistencia", p: "Revisa procesos, tareas programadas y claves Run." },
        { h: "4. Erradicar y restaurar", p: "Elimina los archivos maliciosos y restaura desde backup." }
      ],
      code: [
        {
          head: "PowerShell — caza de persistencia",
          lines: [
            { t: "Get-ScheduledTask | ? State -ne 'Disabled'", c: "p" },
            { t: "WindowsHelper   Ready  <- sospechoso", c: "e" },
            { t: "Stop-Process -Name svchost32 -Force", c: "p" },
            { t: "Remove-Item C:\\Temp\\svchost32.exe", c: "o" }
          ]
        }
      ],
      repo: "https://github.com/danielcortez/malware-ir",
      demo: null
    },

    // ======================== SOPORTE TÉCNICO ========================
    {
      id: "home-lab-build",
      title: "Armado de Home Lab desde Cero",
      cat: "soporte",
      catLabel: "Soporte Técnico",
      date: "2026-07-08",
      duration: "31:25",
      level: "Principiante",
      type: "proyecto",
      desc: "Convierte hardware reciclado en un laboratorio de virtualización con Proxmox.",
      art: "board",
      preview: [
        [{ t: "root@homelab:~# ", c: "p" }, { t: "pveversion", c: "b" }],
        [{ t: "proxmox-ve: 8.2.4 (kernel 6.8)", c: "o" }],
        [{ t: "root@homelab:~# ", c: "p" }, { t: "qm create 100 --name gateway", c: "" }],
        [{ t: "root@homelab:~# ", c: "p" }, { t: "qm set 100 --memory 4096", c: "" }],
        [{ t: "root@homelab:~# ", c: "p" }, { t: "qm start 100", c: "o" }],
        [{ t: "VM 100 corriendo · 4 vCPU · 4GB RAM", c: "o" }]
      ],
      steps: [
        { h: "1. Preparar hardware", p: "Reúne un PC con CPU compatible con virtualización, al menos 16GB RAM y un SSD." },
        { h: "2. Instalar Proxmox", p: "Descarga la ISO y arranca desde USB para instalar el hipervisor." },
        { h: "3. Configurar red", p: "Crea un bridge para que las VMs tengan IP propia." },
        { h: "4. Crear primera VM", p: "Desde la interfaz web, crea una VM con sistema operativo." }
      ],
      code: [
        {
          head: "root@homelab:~# crear VM",
          lines: [
            { t: "qm create 100 --name gateway --memory 4096", c: "p" },
            { t: "qm set 100 --net0 virtio,bridge=vmbr0", c: "" },
            { t: "qm start 100", c: "o" }
          ]
        }
      ],
      repo: "https://github.com/danielcortez/homelab-proxmox",
      demo: "#recomendaciones"
    },
    {
      id: "pc-no-enciende",
      title: "PC que No Enciende — Diagnóstico",
      cat: "soporte",
      catLabel: "Soporte Técnico",
      date: "2026-06-15",
      duration: "14:33",
      level: "Principiante",
      type: "tutorial",
      desc: "Árbol de decisión para aislar fallos sin piezas de repuesto.",
      art: "board",
      preview: [
        [{ t: "> POST check...", c: "p" }],
        [{ t: "[ ] LEDs de la board?  -> apagados", c: "c" }],
        [{ t: "[ ] Ventilador gira?   -> NO", c: "e" }],
        [{ t: "[ ] Voltage 12V (ATX)? -> 0.0V", c: "e" }],
        [{ t: "Diagnóstico: PSU en falla", c: "o" }]
      ],
      steps: [
        { h: "1. Inspección visual", p: "Revisa conexiones de la fuente y la motherboard." },
        { h: "2. Probar fuente", p: "Usa un tester ATX o puentea el pin verde para comprobar voltaje." },
        { h: "3. Probar sin periféricos", p: "Deja solo motherboard, CPU y una RAM para hacer POST." },
        { h: "4. Diagnosticar", p: "Si aún no enciende, aísla entre PSU, board y CPU." }
      ],
      code: [
        {
          head: "Checklist de diagnóstico",
          lines: [
            { t: "[ ] LEDs board ........ apagados", c: "e" },
            { t: "[ ] Ventilador ....... NO gira", c: "e" },
            { t: "[ ] Voltage 12V ATX .. 0.0V", c: "e" },
            { t: "Diagnóstico: PSU en falla", c: "o" }
          ]
        }
      ],
      repo: null,
      demo: null
    },

    // ======================== LINUX / WINDOWS ========================
    {
      id: "dhcp-linux",
      title: "Servidor DHCP en Linux (isc-dhcp-server)",
      cat: "linux",
      catLabel: "Linux / Windows",
      date: "2026-07-01",
      duration: "16:08",
      level: "Intermedio",
      type: "tutorial",
      desc: "Reparte IPs automáticamente en tu red local con rangos y reservas.",
      art: "term",
      preview: [
        [{ t: "admin@srv:~$ ", c: "p" }, { t: "sudo nano /etc/dhcp/dhcpd.conf", c: "b" }],
        [{ t: "subnet 192.168.1.0 netmask 255.255.255.0 {", c: "c" }],
        [{ t: "  range 192.168.1.100 192.168.1.200;", c: "" }],
        [{ t: "  option routers 192.168.1.1;", c: "o" }],
        [{ t: "  option domain-name-servers 8.8.8.8;", c: "o" }],
        [{ t: "admin@srv:~$ ", c: "p" }, { t: "sudo systemctl restart dhcpd", c: "" }],
        [{ t: "● dhcpd.service — Activo (running)", c: "o" }]
      ],
      steps: [
        { h: "1. Instalar isc-dhcp-server", p: "`sudo apt install isc-dhcp-server`" },
        { h: "2. Configurar archivo dhcpd.conf", p: "Define la subred, rango, gateway y DNS." },
        { h: "3. Reiniciar servicio", p: "`sudo systemctl restart isc-dhcp-server`" },
        { h: "4. Verificar leases", p: "Revisa `/var/lib/dhcp/dhcpd.leases` para ver las IPs asignadas." }
      ],
      code: [
        {
          head: "/etc/dhcp/dhcpd.conf",
          lines: [
            { t: "subnet 192.168.1.0 netmask 255.255.255.0 {", c: "c" },
            { t: "  range 192.168.1.100 192.168.1.200;", c: "" },
            { t: "  option routers 192.168.1.1;", c: "o" },
            { t: "  option domain-name-servers 8.8.8.8;", c: "o" },
            { t: "}", c: "c" }
          ]
        }
      ],
      repo: "https://github.com/danielcortez/dhcp-lab",
      demo: null
    },
    {
      id: "windows-deploy",
      title: "Despliegue de Windows 11 por Red",
      cat: "linux",
      catLabel: "Linux / Windows",
      date: "2026-06-02",
      duration: "26:18",
      level: "Avanzado",
      type: "proyecto",
      desc: "Instala Windows 11 en varios equipos con WDS y respuesta desatendida.",
      art: "term",
      preview: [
        [{ t: "PS C:\\> ", c: "p" }, { t: "wdsutil /get-server /show:clients", c: "b" }],
        [{ t: "Clientes pendientes: 6", c: "c" }],
        [{ t: "PS C:\\> ", c: "p" }, { t: "wdsutil /approve-device /id:*", c: "" }],
        [{ t: "Instalando imagen Win11-Pro.wim...", c: "o" }],
        [{ t: "[############] 100%", c: "o" }],
        [{ t: "6 equipos desplegados correctamente", c: "o" }]
      ],
      steps: [
        { h: "1. Instalar WDS", p: "Agrega el rol Windows Deployment Services en Windows Server." },
        { h: "2. Añadir imágenes", p: "Carga boot.wim e install.wim de Windows 11." },
        { h: "3. Configurar archivo de respuesta", p: "Crea un XML desatendido para automatizar la instalación." },
        { h: "4. Arrancar clientes por PXE", p: "Los equipos iniciarán desde la red y recibirán la imagen." }
      ],
      code: [
        {
          head: "PowerShell — Despliegue WDS",
          lines: [
            { t: "wdsutil /get-server /show:clients", c: "p" },
            { t: "Clientes pendientes: 6", c: "c" },
            { t: "wdsutil /approve-device /id:*", c: "o" }
          ]
        }
      ],
      repo: "https://github.com/danielcortez/wds-deploy",
      demo: null
    },
    {
      id: "powershell-basico",
      title: "PowerShell para Administración de Windows",
      cat: "linux",
      catLabel: "Linux / Windows",
      date: "2026-05-15",
      duration: "14:22",
      level: "Intermedio",
      type: "tutorial",
      desc: "Cmdlets esenciales, pipeline y gestión de servicios y procesos en Windows.",
      art: "term",
      preview: [
        [{ t: "PS C:\\> ", c: "p" }, { t: "Get-Process | Where-Object { $_.CPU -gt 10 }", c: "b" }],
        [{ t: "Handles  NPM(K)  PM(K)  WS(K)  CPU     Id  ProcessName", c: "c" }],
        [{ t: " 1234    56    123456  78901   15.2   1024  chrome", c: "o" }],
        [{ t: " 567     12    45678   23456   12.8   2048  powershell", c: "o" }],
        [{ t: "PS C:\\> ", c: "p" }, { t: "Stop-Process -Name chrome -Force", c: "" }],
        [{ t: "Procesos finalizados correctamente.", c: "o" }]
      ],
      steps: [
        { h: "1. Listar procesos con alto consumo", p: "Usa `Get-Process` con filtro por CPU." },
        { h: "2. Detener procesos", p: "Con `Stop-Process` finaliza procesos no deseados." },
        { h: "3. Gestionar servicios", p: "Usa `Get-Service`, `Start-Service`, `Stop-Service`." },
        { h: "4. Pipeline", p: "Encadena cmdlets para tareas complejas." }
      ],
      code: [
        {
          head: "PowerShell — Gestión de procesos",
          lines: [
            { t: "Get-Process | Where-Object { $_.CPU -gt 10 }", c: "p" },
            { t: "Stop-Process -Name chrome -Force", c: "p" },
            { t: "Get-Service | Where-Object { $_.Status -eq 'Stopped' }", c: "p" }
          ]
        }
      ],
      repo: null,
      demo: null
    },
    {
      id: "linux-hardening",
      title: "Hardening de Servidores Linux",
      cat: "linux",
      catLabel: "Linux / Windows",
      date: "2026-04-20",
      duration: "18:33",
      level: "Avanzado",
      type: "tutorial",
      desc: "Aplica buenas prácticas de seguridad a tu servidor Ubuntu: SSH, firewall y fail2ban.",
      art: "term",
      preview: [
        [{ t: "root@srv:~# ", c: "p" }, { t: "ufw allow 22/tcp", c: "" }],
        [{ t: "root@srv:~# ", c: "p" }, { t: "ufw allow 80/tcp", c: "" }],
        [{ t: "root@srv:~# ", c: "p" }, { t: "ufw enable", c: "o" }],
        [{ t: "Firewall activado y configurado", c: "o" }],
        [{ t: "root@srv:~# ", c: "p" }, { t: "systemctl enable fail2ban", c: "" }]
      ],
      steps: [
        { h: "1. Configurar firewall", p: "Usa `ufw` para permitir solo puertos necesarios (SSH, HTTP, HTTPS)." },
        { h: "2. Hardening SSH", p: "Edita `/etc/ssh/sshd_config`: desactiva root login, usa claves." },
        { h: "3. Instalar y configurar Fail2ban", p: "Protege SSH contra fuerza bruta." },
        { h: "4. Actualizaciones automáticas", p: "Configura `unattended-upgrades` para parches de seguridad." }
      ],
      code: [
        {
          head: "Configuración de UFW",
          lines: [
            { t: "ufw allow 22/tcp", c: "" },
            { t: "ufw allow 80/tcp", c: "" },
            { t: "ufw allow 443/tcp", c: "" },
            { t: "ufw enable", c: "o" }
          ]
        },
        {
          head: "Hardening SSH (/etc/ssh/sshd_config)",
          lines: [
            { t: "PermitRootLogin no", c: "o" },
            { t: "PasswordAuthentication no", c: "o" },
            { t: "PubkeyAuthentication yes", c: "o" }
          ]
        }
      ],
      repo: "https://github.com/danielcortez/linux-hardening",
      demo: null
    }
  ];

  window.TUTORIALES = TUTORIALES;

  // ===== LÓGICA DE FILTROS Y RENDER (IGUAL QUE ANTES) =====
  var P = window.Persistencia;
  var $ = function(s, r) { return (r || document).querySelector(s); };
  var $$ = function(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function(s) { return String(s).replace(/[&<>"]/g, function(c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var state = { filter: "all", level: "all", cat: "all", search: "" };

  function renderFilters() {
    var box = $("#filters");
    if (!box) return;
    var tipos = [
      { id: "all", label: "Ver Todo" },
      { id: "proyecto", label: "Proyectos" },
      { id: "tutorial", label: "Tutoriales" },
      { id: "fav", label: "★ Favoritos" }
    ];
    var html = tipos.map(function(t) {
      var n;
      if (t.id === "all") n = TUTORIALES.length;
      else if (t.id === "fav") {
        n = 0;
        for (var i = 0; i < TUTORIALES.length; i++) if (P.isFav(TUTORIALES[i].id)) n++;
      } else {
        n = TUTORIALES.filter(function(p) { return p.type === t.id; }).length;
      }
      return '<button class="filter" role="tab" data-filter="' + esc(t.id) + '">' + esc(t.label) + '<span class="filter__count">' + n + '</span></button>';
    }).join("");
    box.innerHTML = html;
    $$(".filter", box).forEach(function(b) {
      b.addEventListener("click", function() {
        $$(".filter", box).forEach(function(x) { x.classList.remove("active"); });
        b.classList.add("active");
        state.filter = b.dataset.filter;
        applyFilters();
      });
    });
    var first = $(".filter", box);
    if (first) first.classList.add("active");
  }

  function renderLevelFilters() {
    var box = $("#levelFilters");
    if (!box) return;
    var order = ["Principiante", "Intermedio", "Avanzado"];
    var niveles = order.filter(function(l) { return TUTORIALES.some(function(p) { return p.level === l; }); });
    var html = '<button class="filter filter--sec active" role="tab" data-level="all">Todos<span class="filter__count">' + TUTORIALES.length + '</span></button>' +
      niveles.map(function(l) {
        var n = TUTORIALES.filter(function(p) { return p.level === l; }).length;
        return '<button class="filter filter--sec" role="tab" data-level="' + esc(l) + '">' + esc(l) + '<span class="filter__count">' + n + '</span></button>';
      }).join("");
    box.innerHTML = html;
    $$(".filter", box).forEach(function(b) {
      b.addEventListener("click", function() {
        $$(".filter", box).forEach(function(x) { x.classList.remove("active"); });
        b.classList.add("active");
        state.level = b.dataset.level;
        applyFilters();
      });
    });
  }

  function renderCatFilters() {
    var box = $("#catFilters");
    if (!box) return;
    var seen = {}, cats = [];
    TUTORIALES.forEach(function(p) { if (!seen[p.cat]) { seen[p.cat] = true; cats.push({ id: p.cat, label: p.catLabel }); } });
    var html = '<button class="filter filter--sec active" role="tab" data-cat="all">Todas<span class="filter__count">' + cats.length + '</span></button>' +
      cats.map(function(c) {
        var n = TUTORIALES.filter(function(p) { return p.cat === c.id; }).length;
        return '<button class="filter filter--sec" role="tab" data-cat="' + esc(c.id) + '">' + esc(c.label) + '<span class="filter__count">' + n + '</span></button>';
      }).join("");
    box.innerHTML = html;
    $$(".filter", box).forEach(function(b) {
      b.addEventListener("click", function() {
        $$(".filter", box).forEach(function(x) { x.classList.remove("active"); });
        b.classList.add("active");
        state.cat = b.dataset.cat;
        applyFilters();
      });
    });
  }

  function initSearch() {
    var input = $("#tutorialSearch");
    if (!input) return;
    var clear = $("#searchClear");
    var to = null;
    input.addEventListener("input", function() {
      if (clear) clear.hidden = !input.value;
      if (to) clearTimeout(to);
      to = setTimeout(function() {
        state.search = (input.value || "").trim();
        applyFilters();
      }, 180);
    });
    if (clear) clear.addEventListener("click", function() {
      input.value = ""; clear.hidden = true;
      state.search = "";
      input.focus();
      applyFilters();
    });
    var reset = $("#resetFilters");
    if (reset) reset.addEventListener("click", resetAllFilters);
  }

  function resetAllFilters() {
    state.filter = "all"; state.level = "all"; state.cat = "all"; state.search = "";
    var input = $("#tutorialSearch"); if (input) input.value = "";
    var clear = $("#searchClear"); if (clear) clear.hidden = true;
    [["#filters", "data-filter"], ["#levelFilters", "data-level"], ["#catFilters", "data-cat"]].forEach(function(sel) {
      var grp = $(sel[0]); if (!grp) return;
      $$(".filter", grp).forEach(function(b) {
        var active = b.getAttribute(sel[1]) === "all";
        b.classList.toggle("active", active);
      });
    });
    applyFilters();
  }

  function searchIndex(p) {
    var parts = [p.title || "", p.desc || "", p.catLabel || ""];
    (p.preview || []).forEach(function(ln) { ln.forEach(function(seg) { parts.push(seg.t || ""); }); });
    return parts.join(" ").toLowerCase();
  }

  function getFiltered() {
    var s = TUTORIALES.slice();
    if (state.filter === "fav") s = s.filter(function(p) { return P.isFav(p.id); });
    else if (state.filter !== "all") s = s.filter(function(p) { return p.type === state.filter; });
    if (state.level !== "all") s = s.filter(function(p) { return p.level === state.level; });
    if (state.cat !== "all") s = s.filter(function(p) { return p.cat === state.cat; });
    if (state.search) {
      var q = state.search.toLowerCase();
      s = s.filter(function(p) { return searchIndex(p).indexOf(q) !== -1; });
    }
    return s;
  }

  function renderCards(list) {
    var grid = $("#tutorialesGrid");
    var empty = $("#gridEmpty");
    if (!grid) return;
    if (list.length === 0) {
      grid.style.display = "none";
      if (empty) empty.hidden = false;
      return;
    }
    grid.style.display = "";
    if (empty) empty.hidden = true;

    grid.innerHTML = list.map(function(p) {
      var isFav = P.isFav(p.id);
      var isWatched = P.isWatched(p.id);
      var typeLabel = (p.type === "proyecto") ? "Proyecto" : "Tutorial";
      var lvl = p.level === "Avanzado" ? 3 : (p.level === "Intermedio" ? 2 : 1);
      var dots = "";
      for (var d = 1; d <= 3; d++) dots += '<span class="diff__dot' + (d <= lvl ? " on" : "") + '"></span>';
      var icon = p.art === "topo" ? "🌐" : p.art === "shield" ? "🛡️" : p.art === "board" ? "💻" : "⌨️";

      return '<article class="card' + (isWatched ? " is-watched" : "") + (isFav ? " is-fav" : "") + '" data-id="' + esc(p.id) + '" data-modal="' + esc(p.id) + '">' +
        '<div class="thumb">' +
          '<div class="thumb__art" style="background:var(--primary);display:flex;align-items:center;justify-content:center;font-size:3rem;color:#fff;height:120px;">' + icon + '</div>' +
          '<div class="thumb__badge">' + esc(p.catLabel) + '</div>' +
          '<div class="thumb__dur">' + esc(p.duration) + '</div>' +
          '<button class="card__fav" data-fav="' + esc(p.id) + '" aria-pressed="' + (isFav ? "true" : "false") + '">★</button>' +
          (isWatched ? '<span class="card__watched">✓ Visto</span>' : '') +
        '</div>' +
        '<div class="card__body">' +
          '<div class="card__badges">' +
            '<span class="card__badge card__badge--type">' + esc(typeLabel) + '</span>' +
            '<span class="diff" title="Nivel: ' + esc(p.level) + '">' + dots + '<span class="diff__txt">' + esc(p.level) + '</span></span>' +
          '</div>' +
          '<h3 class="card__title">' + esc(p.title) + '</h3>' +
          '<p class="card__desc">' + esc(p.desc) + '</p>' +
          '<div class="card__foot">' +
            '<span class="mono">' + esc(p.date ? p.date.replace(/-/g, " ") : "") + '</span>' +
            '<span class="card__more">Ver detalle →</span>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join("");

    // EVENTO DIRECTO EN CADA TARJETA
    grid.querySelectorAll('.card').forEach(function(card) {
      card.addEventListener('click', function(e) {
        if (e.target.closest('.card__fav')) return;
        e.preventDefault();
        var id = this.dataset.modal;
        console.log('🖱️ Click directo en card con id:', id);
        if (window.Modal && window.Modal.open) {
          window.Modal.open(id);
        } else {
          console.error('❌ window.Modal no está definido o no tiene open');
        }
      });
    });

    grid.querySelectorAll('.card__fav').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var id = this.dataset.fav;
        var on = !P.isFav(id);
        P.setFav(id, on);
        this.setAttribute('aria-pressed', String(on));
        var card = this.closest('.card');
        if (card) card.classList.toggle('is-fav', on);
        updateCounts();
        if (state.filter === 'fav') applyFilters();
      });
    });
  }

  function updateCounts() {
    var fbox = $("#filters");
    if (fbox) $$(".filter", fbox).forEach(function(b) {
      var id = b.dataset.filter, n;
      if (id === "all") n = TUTORIALES.length;
      else if (id === "fav") {
        n = 0;
        for (var i = 0; i < TUTORIALES.length; i++) if (P.isFav(TUTORIALES[i].id)) n++;
      } else {
        n = TUTORIALES.filter(function(p) { return p.type === id; }).length;
      }
      var c = $(".filter__count", b); if (c) c.textContent = n;
    });
    var lbox = $("#levelFilters");
    if (lbox) $$(".filter", lbox).forEach(function(b) {
      var id = b.dataset.level;
      var n = id === "all" ? TUTORIALES.length : TUTORIALES.filter(function(p) { return p.level === id; }).length;
      var c = $(".filter__count", b); if (c) c.textContent = n;
    });
    var cbox = $("#catFilters");
    if (cbox) $$(".filter", cbox).forEach(function(b) {
      var id = b.dataset.cat;
      var n = id === "all" ? TUTORIALES.length : TUTORIALES.filter(function(p) { return p.cat === id; }).length;
      var c = $(".filter__count", b); if (c) c.textContent = n;
    });
  }

  function applyFilters() {
    var list = getFiltered();
    renderCards(list);
    var total = TUTORIALES.length;
    var done = 0;
    for (var i = 0; i < total; i++) if (P.isWatched(TUTORIALES[i].id)) done++;
    var fill = $("#progressFill");
    var doneEl = $("#progressDone");
    var totalEl = $("#progressTotal");
    if (fill) fill.style.width = total ? Math.round((done / total) * 100) + "%" : "0%";
    if (doneEl) doneEl.textContent = done;
    if (totalEl) totalEl.textContent = total;
  }

  function init() {
    console.log('📚 Inicializando Tutoriales...');
    renderFilters();
    renderLevelFilters();
    renderCatFilters();
    initSearch();
    applyFilters();
    console.log('✅ Tutoriales inicializados');
  }

  document.addEventListener('secciones-cargadas', init);
})();