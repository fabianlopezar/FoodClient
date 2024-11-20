import React from "react";
//importar css
import "../styles/Footer.css";

function Footer() {
  return (
    <div className="posicionador-footer">
      <div className="contenedor-footer">
        <div className="footer">
          {/* Column1 */}
          <div className="col">
            <h4>Creador:</h4>
            <ul className="list-unstyled">
              <li>Fabian Esteban Lopez Arias</li>
              <li>fabian_lopez.edu.co</li>
              <li>David Roa</li>
              <li>david@uao.edu.co</li>
            </ul>
          </div>
            {/* Column2 */}
            <div className="col">
            <h4>Creditos</h4>
            <ul className="list-unstyled">
              <li>Refencias</li>
              
            </ul>
          </div>
          {/* Column3 */}
          <div className="col">
            <h4>Redes Sociales</h4>
            <ui className="list-unstyled">
              <li>
                <a
                  href="https://twitter.com/FabianLopeza5"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white a"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/channel/UCH9-MdRsuL16VmachYoS4og"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white a"
                >
                  Youtube
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/fabianlopezar"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white a"
                >
                  GitHub
                </a>
              </li>
            </ui>
          </div>
        </div>
        <hr />
        <div className="abajo">
          <p className="">
            &copy;{new Date().getFullYear()} Proyecto Grupal Fabian Lopez | David Roa
            All rights reserved | Terms Of Service | Privacy...
          </p>
        </div>
      </div>
    </div>
  );
}
export default Footer;
