import s from "./Index.module.scss";

export default function Footer() {
  return (
    <div className={s.footerWrapper}>
      <div className={s.container}>
        <div className={s.footer}>
          <div className={s.col}>
            <h4>Equipo UAO</h4>
            <ul className={s.list}>
              <li>Fabian Esteban Lopez Arias</li>
              <li>fabianlopez928@gmail.com</li>
            </ul>
          </div>
          <div className={s.col}>
            <h4>Créditos</h4>
            <ul className={s.list}>
              <li>Spoonacular API / Backend PI</li>
              <li>Firebase Realtime</li>
            </ul>
          </div>
          <div className={s.col}>
            <h4>Redes Sociales</h4>
            <ul className={s.list}>
              <li>
                <a
                  href="https://twitter.com/FabianLopeza5"
                  target="_blank"
                  rel="noreferrer"
                  className={s.link}
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/fabianlopezar"
                  target="_blank"
                  rel="noreferrer"
                  className={s.link}
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr className={s.divider} />
        <div className={s.bottom}>
          <p>
            &copy;{new Date().getFullYear()} FoodClient UAO — All rights
            reserved
          </p>
        </div>
      </div>
    </div>
  );
}
