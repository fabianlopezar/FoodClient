import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { postRecipes, getTypeDiet } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import s from "../styles/Create.module.css";
import Footer from "./Footer";

const initialInput = {
  title: "",
  summary: "",
  healthScore: "",
  analyzedInstructions: "",
  typeDiet: [],
};

function validateForm(input) {
  const errors = {};
  if (!input.title?.trim()) errors.title = "You should enter a title";
  if (!input.summary?.trim()) errors.summary = "You should enter a summary";
  const score = Number(input.healthScore);
  if (
    input.healthScore !== "" &&
    (Number.isNaN(score) || score < 0 || score > 100)
  ) {
    errors.healthScore = "Enter a number between 0 and 100";
  }
  return errors;
}

export function Create() {
  const dispatch = useDispatch();
  const diets = useSelector((state) => state.typeDiet);
  const [errors, setErrors] = useState({});
  const [input, setInput] = useState(initialInput);

  useEffect(() => {
    dispatch(getTypeDiet());
  }, [dispatch]);

  const handleChange = useCallback(
    (e) => {
      const next = { ...input, [e.target.name]: e.target.value };
      setInput(next);
      setErrors(validateForm(next));
    },
    [input]
  );

  const handleSelect = useCallback(
    (e) => {
      const value = e.target.value;
      if (!value) return;
      setInput({
        ...input,
        typeDiet: input.typeDiet.includes(value)
          ? input.typeDiet
          : [...input.typeDiet, value],
      });
    },
    [input]
  );

  const handleDelete = useCallback(
    (diet) => {
      setInput({
        ...input,
        typeDiet: input.typeDiet.filter((el) => el !== diet),
      });
    },
    [input]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const formErrors = validateForm(input);
      setErrors(formErrors);

      if (Object.keys(formErrors).length > 0) {
        return;
      }

      try {
        await dispatch(postRecipes(input));
        setInput(initialInput);
        setErrors({});
        alert("The recipe was created successfully.");
      } catch (err) {
        alert("Could not create recipe. Please try again.");
      }
    },
    [input, dispatch]
  );

  const hasErrors =
    errors.title || errors.summary || errors.healthScore;

  return (
    <div id={s.fondo}>
      <Link to="/home">
        <button type="button" className={s.btn}>
          BACK
        </button>
      </Link>

      <div className={s.card}>
        <h1 className={s.title}>Recipe Creator</h1>
        <form className={s.ent} onSubmit={handleSubmit}>
          <div>
            <label className={s.label} htmlFor="create-title">
              Title:
            </label>
            <input
              id="create-title"
              placeholder="Title of Recipe"
              className={s.input}
              type="text"
              value={input.title}
              name="title"
              onChange={handleChange}
            />
            {errors.title && (
              <p className={s.labelError}>{errors.title}</p>
            )}
          </div>

          <div>
            <label className={s.label} htmlFor="create-summary">
              Summary:
            </label>
            <input
              id="create-summary"
              placeholder="Summary of Recipe"
              className={s.input}
              type="text"
              name="summary"
              value={input.summary}
              onChange={handleChange}
            />
            {errors.summary && (
              <p className={s.labelError}>{errors.summary}</p>
            )}
          </div>

          <div>
            <label className={s.label} htmlFor="create-healthScore">
              Health Score:
            </label>
            <input
              id="create-healthScore"
              placeholder="0 - 100"
              className={s.input}
              min="0"
              max="100"
              type="number"
              name="healthScore"
              value={input.healthScore}
              onChange={handleChange}
            />
            {errors.healthScore && (
              <p className={s.labelError}>{errors.healthScore}</p>
            )}
          </div>

          <div>
            <label className={s.label} htmlFor="create-instructions">
              Analyzed Instructions:
            </label>
            <input
              id="create-instructions"
              placeholder="Steps of Recipe"
              className={s.input}
              type="text"
              name="analyzedInstructions"
              value={input.analyzedInstructions}
              onChange={handleChange}
            />
          </div>

          <label className={s.label} htmlFor="create-diet">
            Diet:
          </label>
          <select
            id="create-diet"
            className={s.select}
            onChange={handleSelect}
            value=""
          >
            <option value="">Select diet</option>
            {diets?.map((diet) => (
              <option key={diet} value={diet}>
                {diet}
              </option>
            ))}
          </select>

          {hasErrors && (
            <p className={s.labelError}>
              Please complete all required fields correctly.
            </p>
          )}
          <button className={s.btn} type="submit" disabled={!!hasErrors}>
            Create new Recipe
          </button>
        </form>

        {input.typeDiet.length > 0 && (
          <div className={s.selectedDiets}>
            {input.typeDiet.map((el) => (
              <div key={el}>
                <span className={s.label}>{el}</span>
                <button
                  type="button"
                  className={s.button}
                  onClick={() => handleDelete(el)}
                  aria-label={`Remove ${el}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
