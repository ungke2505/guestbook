frappe.pages['meja-layout'].on_page_load = function(wrapper) {
    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Visual Layout Meja',
        single_column: true
    });

    const container = $('<div class="meja-layout-container">').appendTo(page.body);

    frappe.call('guestbook.api.get_table_layout').then(r => {
        const data = r.message;
        data.forEach(table => {
            const tableDiv = $(`<div class="meja-wrapper"><div class="meja-center">${table.table_number}</div></div>`);
            
            const angleStep = 360 / table.capacity;
            const radius = 100;

            for (let i = 0; i < table.capacity; i++) {
                const guest = table.guests[i];
                const chair = $(`<div class="kursi ${guest ? 'occupied' : ''}">${guest ? guest.split(" ")[0] : ""}</div>`);

                const angle = i * angleStep;
                const top = Math.sin(angle * Math.PI / 180) * radius + 120;
                const left = Math.cos(angle * Math.PI / 180) * radius + 120;

                chair.css({
                    top: `${top}px`,
                    left: `${left}px`
                });

                tableDiv.append(chair);
            }

            container.append(tableDiv);
        });
    });
};
