import React from "react";
import s from "./Index.module.scss";

export default function Paginado({ itemsPerPage, allItems, paginado }) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(allItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className={s.ul}>
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              type="button"
              className={s.container}
              onClick={() => paginado(number)}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
