import React, { useState } from "react";
import {
  SchemaForm,
  InternalField as Field,
  createFormActions
} from "@formily/react-schema-renderer";

const actions = createFormActions();

export default function App() {

  const [started, setStarted] = useState(false)

  const renderExercises = () => {
    let ret = [];
    for (let i = 0; i < 100; i++) {
      ret.push(
        <Field key={i} name={`Exercise${i}`} initialValue={i}>
          {({ form, state, props, mutators }) => {
            return <React.Fragment><div>{state.value}</div></React.Fragment>
          }}
        </Field>
      );
    }
    return ret;
  };

  return (
    !started ? <button onClick={() => setStarted(true)}> 开始</button> : <SchemaForm actions={actions} schema={{ type: "object" }}>
      {renderExercises()}
    </SchemaForm>
  );
}
