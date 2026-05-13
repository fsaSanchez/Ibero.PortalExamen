import type { HTMLAttributes } from "react";
import { createElement } from "react";
import styled from "styled-components";
import * as MuiIcons from "@mui/icons-material";

export type IconName = string;

const ColorComponent = styled.div<{ color?: string }>`
  color: ${({ color }) => color || "black"};

  & > svg {
    path,
    rect {
      stroke: ${({ color }) => color || "black"};
    }
  }
`;

interface Props extends HTMLAttributes<HTMLDivElement> {
  icon: IconName;
  className?: string;
  rotate?: number;
  size?: string;
  color?: string;
}

/**
 * Convierte un string de kebab-case o snake_case a PascalCase.
 * Ejemplo: "delete-forever" -> "DeleteForever"
 */
const toPascalCase = (str: string) => {
  return str
    .replace(/([-_][a-z])/gi, ($1) =>
      $1.toUpperCase().replace("-", "").replace("_", "")
    )
    .replace(/^(.)/, ($1) => $1.toUpperCase());
};

/**
 * Componente para mostrar iconos de Material-UI.
 * Si no encuentra el icono especificado, muestra ArrowRight por defecto.
 */
export const IconIbero = ({
  icon,
  className,
  rotate,
  size = "25px",
  color,
  ...rest
}: Props) => {
  const pascalCaseName = toPascalCase(icon);

  // @ts-ignore - búsqueda dinámica en el objeto MuiIcons
  let IconComponent = MuiIcons[pascalCaseName];

  // Fallback a ArrowRight si no existe
  if (!IconComponent) {
    console.warn(`Icono no encontrado: "${icon}". Se usará ArrowRight por defecto.`);
    IconComponent = MuiIcons.ArrowRight;
  }

  return (
    <ColorComponent
      color={color}
      className={className}
      aria-label={icon}
      role="img"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        width: size,
        height: size,
      }}
      {...rest}
    >
      {createElement(IconComponent, {
        style: { width: size, height: size, color },
        fontSize: "inherit",
      })}
    </ColorComponent>
  );
};
