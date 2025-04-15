let aziende = {
  YMIT: [],
  YMR: []
};
let currentUtente = null;

function caricaDati() {
  const datiSalvati = localStorage.getItem('aziende');
  if (datiSalvati) aziende = JSON.parse(datiSalvati);
  aggiornaRiepilogo();
  aggiornaListaUtenti();
}

function salvaDati() {
  localStorage.setItem('aziende', JSON.stringify(aziende));
}

function aggiornaListaUtenti(searchQuery = "") {
  const lista = document.getElementById("utentiAziende");
  lista.innerHTML = "";
  const aziendaSelezionata = document.getElementById("aziendaSelect").value;
  const utenti = aziende[aziendaSelezionata];
  const utentiFiltrati = utenti.filter(u => u.nome.toLowerCase().includes(searchQuery.toLowerCase()));

  utentiFiltrati.forEach((utente, index) => {
    const btn = document.createElement("button");
    btn.innerText = `👤 ${utente.nome}`;
    btn.className = "utente-button";
    btn.onclick = () => selezionaUtente(aziendaSelezionata, index);
    lista.appendChild(btn);
  });
  salvaDati();
}

function selezionaUtente(azienda, index) {
  currentUtente = { azienda, index };
  const utente = aziende[azienda][index];

  document.getElementById("modificaMateriale").style.display = "block";
  mostraDettagliMateriale("laptop");

  document.getElementById("materialiAssegnati").style.display = "block";
  document.getElementById("utenteNome").innerText = utente.nome;
  const lista = document.getElementById("listaMateriali");
  lista.innerHTML = "";

  if (utente.materiali.length === 0) {
    lista.innerHTML = "<li>Nessun materiale assegnato</li>";
  } else {
    utente.materiali.forEach((m) => {
      const item = document.createElement("li");
      item.textContent = `${m.nome}: ${m.details}`;
      lista.appendChild(item);
    });
  }
}

function creaUtente() {
  const nome = document.getElementById("nomeUtente").value.trim();
  const azienda = document.getElementById("aziendaSelect").value;
  if (!nome) return alert("Inserisci un nome valido");

  aziende[azienda].push({ nome, azienda, materiali: [] });
  document.getElementById("nomeUtente").value = "";
  aggiornaListaUtenti();
  aggiornaRiepilogo();
  salvaDati();
}

function mostraDettagliMateriale(tipo) {
  const div = document.getElementById("dettagliMateriale");
  let html = "";

  if (tipo === "laptop") {
    html = `
      <input type="text" id="nomePc" placeholder="Nome PC" required>
      <input type="text" id="serialeLaptop" placeholder="Seriale" required>
      <input type="text" id="modelloLaptop" placeholder="Modello" required>
    `;
  } else if (tipo === "telefono") {
    html = `
      <input type="text" id="serialeTelefono" placeholder="Seriale" required>
      <input type="text" id="imeiTelefono" placeholder="IMEI" required>
    `;
  } else if (tipo === "sim") {
    html = `
      <input type="text" id="numeroTelefono" placeholder="Numero" required>
      <input type="text" id="serialeSim" placeholder="Seriale SIM" required>
      <select id="tipoSim">
        <option value="SIM VOCE">SIM VOCE</option>
        <option value="SIM DATI">SIM DATI</option>
      </select>
    `;
  } else if (tipo === "monitor") {
    html = `
      <input type="text" id="serialeMonitor" placeholder="Seriale" required>
      <input type="text" id="modelloMonitor" placeholder="Modello" required>
    `;
  } else if (tipo === "docking") {
    html = `
      <input type="text" id="serialeDocking" placeholder="Seriale" required>
      <input type="text" id="modelloDocking" placeholder="Modello" required>
    `;
  }

  div.innerHTML = html;
}

function aggiungiMateriale() {
  const tipo = document.getElementById("tipoMateriale").value;
  const utente = aziende[currentUtente.azienda][currentUtente.index];
  let details = "";

  if (tipo === "laptop") {
    details = `Nome PC: ${document.getElementById("nomePc").value}, Seriale: ${document.getElementById("serialeLaptop").value}, Modello: ${document.getElementById("modelloLaptop").value}`;
  } else if (tipo === "telefono") {
    details = `Seriale: ${document.getElementById("serialeTelefono").value}, IMEI: ${document.getElementById("imeiTelefono").value}`;
  } else if (tipo === "sim") {
    details = `Numero: ${document.getElementById("numeroTelefono").value}, Seriale: ${document.getElementById("serialeSim").value}, Tipo: ${document.getElementById("tipoSim").value}`;
  } else if (tipo === "monitor") {
    details = `Seriale: ${document.getElementById("serialeMonitor").value}, Modello: ${document.getElementById("modelloMonitor").value}`;
  } else if (tipo === "docking") {
    details = `Seriale: ${document.getElementById("serialeDocking").value}, Modello: ${document.getElementById("modelloDocking").value}`;
  }

  utente.materiali.push({ nome: tipo, details });
  aggiornaListaUtenti();
  selezionaUtente(currentUtente.azienda, currentUtente.index);
  aggiornaRiepilogo();
  salvaDati();
}

function exportToCSV() {
  const righe = ["Azienda,Utente,Materiale,Dettagli"];
  for (const azienda in aziende) {
    aziende[azienda].forEach(u => {
      u.materiali.forEach(m => {
        righe.push(`${azienda},${u.nome},${m.nome},${m.details}`);
      });
    });
  }
  const blob = new Blob([righe.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "materiali.csv";
  link.click();
}

function aggiornaRiepilogo() {
  const box = document.getElementById("riepilogoAzienda");
  box.innerHTML = "";
  for (const azienda in aziende) {
    const utenti = aziende[azienda];

    const conteggioMateriali = {
      laptop: 0,
      telefono: 0,
      sim: 0,
      monitor: 0,
      docking: 0
    };

    utenti.forEach(u => {
      u.materiali.forEach(m => {
        if (conteggioMateriali[m.nome] !== undefined) {
          conteggioMateriali[m.nome]++;
        }
      });
    });

    box.innerHTML += `
      <div class="riepilogo-card">
        <h3>🏢 ${azienda}</h3>
        <p>👥 Utenti: <strong>${utenti.length}</strong></p>
        <p>💻 Laptop: <strong>${conteggioMateriali.laptop}</strong></p>
        <p>📱 Telefono: <strong>${conteggioMateriali.telefono}</strong></p>
        <p>📶 SIM: <strong>${conteggioMateriali.sim}</strong></p>
        <p>🖥️ Monitor: <strong>${conteggioMateriali.monitor}</strong></p>
        <p>🔌 Docking: <strong>${conteggioMateriali.docking}</strong></p>
      </div>
    `;
  }
}

function filtraUtenti() {
  const q = document.getElementById("search").value;
  aggiornaListaUtenti(q);
}

window.onload = caricaDati;
