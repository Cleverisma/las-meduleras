import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Donante {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    celular: string;
    es_donante_previo: number;
    es_donante_medula: number;
    created_at: string;
}

export const generateDonorsPDF = (donors: Donante[]) => {
    const doc = new jsPDF();

    const tableColumn = ["Nombre", "Apellido", "DNI", "Celular", "Donante Sangre", "Donante Médula", "Fecha Registro"];
    const tableRows: any[] = [];

    donors.forEach(donor => {
        const donorData = [
            donor.nombre,
            donor.apellido,
            donor.dni,
            donor.celular,
            donor.es_donante_previo === 1 ? "Sí" : "No",
            donor.es_donante_medula === 1 ? "Sí" : "No",
            new Date(donor.created_at).toLocaleDateString()
        ];
        tableRows.push(donorData);
    });

    // Add title
    doc.text("Listado de Donantes - Las Meduleras", 14, 15);

    // Generate table
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    // Save PDF
    doc.save("donantes_las_meduleras.pdf");
};
