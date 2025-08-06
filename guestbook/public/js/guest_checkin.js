// document.addEventListener("DOMContentLoaded", function () {
//   const nameInput = document.getElementById("guest-name");
//   const searchBtn = document.getElementById("search-guest");
//   const resultDiv = document.getElementById("result");

//   // Auto-suggest saat user mengetik
//   nameInput.addEventListener("keyup", function () {
//     const query = nameInput.value.trim();
//     if (query.length < 2) {
//       document.getElementById("suggestions")?.remove();
//       return;
//     }

//     frappe.call({
//       method: "guestbook.api.search_guest_names",
//       args: { query },
//       callback: function (r) {
//         const guests = r.message;
//         let container = document.getElementById("suggestions");
//         if (!container) {
//           container = document.createElement("div");
//           container.id = "suggestions";
//           container.style.border = "1px solid #ccc";
//           container.style.padding = "5px";
//           container.style.maxHeight = "150px";
//           container.style.overflowY = "auto";
//           container.style.background = "#fff";
//           nameInput.parentNode.appendChild(container);
//         }

//         container.innerHTML = "";
//         if (guests.length === 0) {
//           container.innerHTML = "<small>Tidak ditemukan</small>";
//           return;
//         }

//         guests.forEach(guest => {
//           const item = document.createElement("div");
//           item.innerHTML = `${guest.full_name} <small style="color:gray;">(${guest.address || '-'})</small>`;
//           item.style.padding = "4px";
//           item.style.cursor = "pointer";
//           item.addEventListener("click", () => {
//             nameInput.value = guest.full_name;
//             container.remove();
//             loadGuestDetail(guest.full_name);
//           });
//           container.appendChild(item);
//         });
//       }
//     });
//   });

//   // Klik tombol cari
//   searchBtn.addEventListener("click", () => {
//     const name = nameInput.value.trim();
//     if (!name) {
//       resultDiv.innerHTML = `<p style="color:red;">Masukkan nama tamu terlebih dahulu.</p>`;
//       return;
//     }
//     loadGuestDetail(name);
//   });

//   // Fungsi umum untuk load data tamu
//   window.loadGuestDetail = function (name) {
//     resultDiv.innerHTML = `🔍 Mencari...`;

//     frappe.call({
//       method: "guestbook.api.check_in_guest",
//       args: { full_name: name },
//       callback: function (r) {
//         const data = r.message;

//         if (!data.success) {
//           resultDiv.innerHTML = `<p style="color:red;">❌ ${data.message}</p>`;
//           return;
//         }

//         resultDiv.innerHTML = `
//           <p>✅ <strong>${name}</strong> ditemukan.</p>
//           <p>🧑 Grup: ${data.group}</p>
//           <p>📍 Alamat: ${data.address || '-'}</p>
//           <p>🪑 Nomor Meja: ${data.table_number}</p>
//           <p>📌 Status: ${data.status}</p>
//           ${
//             data.status === "Not Arrived"
//               ? `<button id="mark-arrived">Tandai Hadir</button>`
//               : `<p style="color:green;">Tamu sudah hadir.</p>`
//           }
//         `;

//         if (data.status === "Not Arrived") {
//           document.getElementById("mark-arrived").addEventListener("click", () => {
//             frappe.call({
//               method: "guestbook.api.mark_guest_arrived",
//               args: { full_name: name },
//               callback: function (res) {
//                 if (res.message.success) {
//                   resultDiv.innerHTML += `<p style="color:green;">✅ ${res.message.message}</p>`;
//                 } else {
//                   resultDiv.innerHTML += `<p style="color:red;">❌ ${res.message.message}</p>`;
//                 }
//               },
//             });
//           });
//         }
//       }
//     });
//   };
// });



document.addEventListener("DOMContentLoaded", function () {
  const nameInput = document.getElementById("guest-name");
  const searchBtn = document.getElementById("search-guest");
  const resultDiv = document.getElementById("result");

  // Auto-suggest
  nameInput.addEventListener("keyup", function () {
    const query = nameInput.value.trim();
    if (query.length < 2) {
      document.getElementById("suggestions")?.remove();
      return;
    }

    frappe.call({
      method: "guestbook.api.search_guest_names",
      args: { query },
      callback: function (r) {
        const guests = r.message;
        let container = document.getElementById("suggestions");
        if (!container) {
          container = document.createElement("div");
          container.id = "suggestions";
          container.style.border = "1px solid #ccc";
          container.style.padding = "5px";
          container.style.maxHeight = "150px";
          container.style.overflowY = "auto";
          container.style.background = "#fff";
          nameInput.parentNode.appendChild(container);
        }

        container.innerHTML = "";
        if (guests.length === 0) {
          container.innerHTML = "<small>Tidak ditemukan</small>";
          return;
        }

        guests.forEach(guest => {
          const item = document.createElement("div");
          item.innerHTML = `${guest.full_name} <small style="color:gray;">(${guest.address || '-'})</small>`;
          item.style.padding = "4px";
          item.style.cursor = "pointer";
          item.addEventListener("click", () => {
            nameInput.value = guest.full_name;
            container.remove();
            loadGuestDetail(guest.full_name);
          });
          container.appendChild(item);
        });
      }
    });
  });

  // Klik tombol cari
  searchBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name) {
      resultDiv.innerHTML = `<p style="color:red;">Masukkan nama tamu terlebih dahulu.</p>`;
      return;
    }
    loadGuestDetail(name);
  });

  // Fungsi utama: tampilkan detail tamu
  window.loadGuestDetail = function (name) {
    resultDiv.innerHTML = `🔍 Mencari...`;

    frappe.call({
      method: "guestbook.api.check_in_guest",
      args: { full_name: name },
      callback: function (r) {
        const data = r.message;

        if (!data.success) {
          resultDiv.innerHTML = `<p style="color:red;">❌ ${data.message}</p>`;
          return;
        }

        let content = `
          <p>✅ <strong>${name}</strong> ditemukan.</p>
          <p>🧑 Grup: ${data.group}</p>
          <p>📍 Alamat: ${data.address || '-'}</p>
          <p>🪑 Nomor Meja: ${data.table_number}</p>
          <p>📌 Status: ${data.status}</p>
        `;

        if (data.status === "Not Arrived") {
          content += `
            <label>👥 Jumlah orang hadir: </label>
            <input type="number" id="attendees-count" value="1" min="1" style="width: 60px; margin-left: 10px;" />
            <br><br>
            <button id="mark-arrived">Tandai Hadir</button>
          `;
        } else {
          content += `<p style="color:green;">Tamu sudah hadir.</p>`;
        }

        resultDiv.innerHTML = content;

        // Tombol check-in
        if (data.status === "Not Arrived") {
          document.getElementById("mark-arrived").addEventListener("click", () => {
            const attendees = parseInt(document.getElementById("attendees-count").value) || 1;

            frappe.call({
              method: "guestbook.api.mark_guest_arrived",
              args: {
                full_name: name,
                attendees: attendees
              },
              callback: function (res) {
                if (res.message.success) {
                  resultDiv.innerHTML = `
                    <p style="font-size: 1.2em; color: green;">
                      ✅ ${res.message.message}<br><br>
                      Terima kasih atas kedatangan Bapak / Ibu 🙏
                    </p>
                  `;
                  nameInput.value = "";
                } else {
                  resultDiv.innerHTML = `<p style="color:red;">❌ ${res.message.message}</p>`;
                }

              },
            });
          });
        }
      }
    });
  };
});
