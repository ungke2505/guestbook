import frappe
from frappe.utils import now

# @frappe.whitelist()
# def check_in_guest(full_name):
#     guest = frappe.db.get("Guest", {"full_name": full_name})
#     if not guest:
#         return {"success": False, "message": "Tamu tidak ditemukan."}

#     return {
#         "success": True,
#         "status": guest.status,
#         "table_number": guest.table_number,
#         "group": guest.group,
#         "address": guest.address
#     }
@frappe.whitelist()
def check_in_guest(full_name):
    guest = frappe.db.get("Guest", {"full_name": full_name})
    if not guest:
        return {"success": False, "message": "Tamu tidak ditemukan."}

    table_number = None
    if guest.table:
        table_doc = frappe.get_doc("Table", guest.table)
        table_number = table_doc.table_number

    return {
        "success": True,
        "status": guest.status,
        "table_number": table_number,
        "group": guest.group,
        "address": guest.address
    }



@frappe.whitelist()
def mark_guest_arrived(full_name):
    guest = frappe.get_doc("Guest", {"full_name": full_name})
    if not guest:
        return {"success": False, "message": "Tamu tidak ditemukan."}

    if guest.status == "Arrived":
        return {"success": False, "message": "Tamu sudah check-in sebelumnya."}

    guest.status = "Arrived"
    guest.check_in_time = now()
    guest.save()
    return {"success": True, "message": "Tamu berhasil ditandai hadir."}

@frappe.whitelist()
def search_guest_names(query):
    guests = frappe.db.get_all("Guest",
        filters={"full_name": ["like", f"%{query}%"]},
        fields=["name", "full_name", "address", "status"]
    )

    return guests



@frappe.whitelist()
def get_table_layout():
    tables = frappe.get_all("Table", fields=["name", "table_number", "capacity"])
    result = []

    for table in tables:
        guests = frappe.get_all("Guest", filters={"table": table.name}, fields=["full_name"])
        result.append({
            "table_number": table.table_number,
            "capacity": table.capacity,
            "guests": [g.full_name for g in guests]
        })

    return result

@frappe.whitelist()
def mark_guest_arrived(full_name, attendees=1):
    guest = frappe.get_doc("Guest", {"full_name": full_name})
    if not guest:
        return {"success": False, "message": "Tamu tidak ditemukan."}

    if guest.status == "Arrived":
        return {"success": False, "message": "Tamu sudah check-in sebelumnya."}

    guest.status = "Arrived"
    guest.check_in_time = now()
    guest.number_of_attendees = int(attendees)
    guest.save()

    return {"success": True, "message": "Tamu berhasil ditandai hadir."}
