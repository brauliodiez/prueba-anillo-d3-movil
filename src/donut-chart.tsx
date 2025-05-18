import React, { useEffect, useRef } from "react";
// Importamos las funciones necesarias de D3
import { select } from "d3-selection";
import { arc, pie } from "d3-shape";
import type { PieArcDatum } from "d3-shape";
import type { Selection } from "d3-selection";

interface DonutChartProps {
  percentage: number; // El valor a mostrar (0–100)
  width?: number; // Ancho del SVG (opcional)
  height?: number; // Alto del SVG (opcional)
  thickness?: number; // Grosor del anillo (opcional)
}

const DonutChart: React.FC<DonutChartProps> = ({
  percentage,
  width = 200,
  height = 200,
  thickness = 20,
}) => {
  // Asignamos un ref al SVG para manipularlo con D3
  // ya que D3 no está diseñado para trabajar con React
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // Calcula el radio máximo en base al ancho y alto
    // Se queda con el más pequeño de los dos para no salirse del SVG
    const radius = Math.min(width, height) / 2;

    const color = "#66bb6a"; // Color de la barra de porcentaje verde claro (barra)
    const bgColor = "#e0e0e0"; // Colo del fondo del anillo verde oscuro (fondo)

    // Seleccionamos el SVG y le damos un ancho y un alto
    const svg = select(ref.current).attr("width", width).attr("height", height);

    // Un grupo es como un "div" de HTML
    // aquí vemos si ya existe un grupo "g" dentro del SVG
    // Si no existe, lo creamos
    const g: Selection<SVGGElement, unknown, null, undefined> = svg
      .select("g")
      .empty()
      ? svg.append("g")
      : svg.select("g");

    // Nos movemos al centro del SVG, desde ahí partiremos para pintar el círculo
    g.attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Limpiamos el grupo "g" para evitar que se acumulen los gráficos
    g.selectAll().remove();

    // Creamos el generador de arcos (arc) y el generador de sectores (pie)
    const arcGen = arc<PieArcDatum<number>>()
      .innerRadius(radius - thickness) // Radio interior (para hueco)
      .outerRadius(radius); // Radio exterior (borde externo)

    // Crea función para dividir en ángulos sin ordenar
    const pieGen = pie<number>().sort(null);
    // Separa el porcentaje y el resto
    const pieData = pieGen([percentage, 100 - percentage]);

    // Aquí dibujamos el circulo completo del donut (el que se pone con color oscuro)
    // Fondo (100%)
    g.append("path")
      .datum(pieGen([1])[0])
      .attr("d", arcGen as any)
      .attr("fill", bgColor);

    // Aquí dibujamos el círculo del porcentaje activo (el que se pone con color claro)
    // Porcentaje activo
    g.append("path")
      .datum(pieData[0])
      .attr("d", arcGen as any)
      .attr("fill", color);

    // Texto en el centro
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "32px")
      .style("font-weight", "bold")
      .style("fill", "#2e7d32") // también en verde oscuro
      .text(`${percentage}%`);
    // Y en el useEffect ponemos las dependencias por si alguna cambia que se vuelve a redibujar
    // el gráfico
  }, [percentage, width, height, thickness]);

  // Aquí puedes ver el SVG que referenciamos con React
  return (
    <svg ref={ref}>
      <g />
    </svg>
  );
};

export default DonutChart;
