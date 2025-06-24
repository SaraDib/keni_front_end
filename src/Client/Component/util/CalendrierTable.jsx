export default function CalendrierTable() {
    const schedule = [
      ["", "", "09h00 - 09h45 Gymnastique vertébrale (Michelle)", "", ""],
      ["", "", "10h00 - 10h45 Gymnastique vertébrale (Mandy)", "10h00 - 10h45 Équilibre (Brigitte)", ""],
      ["", "10h30 - 11h30 Corps & Âme (Brigitte)", "", "", ""],
      ["", "12h00 - 12h45 Yoga (Brigitte)", "", "", "13h00 - 13h30 Étirements (Anastasia)"],
      ["17h00 - 17h45 Pilates (Michelle)", "16h45 - 17h30 Gymnastique vertébrale (Michelle)", "", "17h00 - 17h45 Pilates - Débutants (Michelle)", ""],
      ["18h00 - 18h45 Ventre et dos (Alina)", "17h45 - 18h15 BBP – Ventre Jambes Fesses (Michelle)", "", "", ""],
    ];
  
    return (
      <div className="pt-10 p-4 max-w-full overflow-hidden bg-white ">
          <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">Plan de formation</h1>
          <div className="max-w-full overflow-auto border border-gray-300 rounded-lg" style={{ maxHeight: '400px' }}>
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-3 border border-gray-300">Lundi</th>
                <th className="p-3 border border-gray-300">Mardi</th>
                <th className="p-3 border border-gray-300">Mercredi</th>
                <th className="p-3 border border-gray-300">Jeudi</th>
                <th className="p-3 border border-gray-300">Vendredi</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`p-2 md:p-4 border border-gray-300 ${cell ? "text-gray-700" : "bg-gray-100"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
}