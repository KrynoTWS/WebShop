import { useState } from "react";

const useDropdown = (label, defaultState, options) => {
  const [state, setState] = useState(defaultState);
  const [optionList, setOptionList] = useState(options);

  const Dropdown = () => (
    <label>
      {label}: {state}
      <br />
      <select value={state} onChange={e => setState(e.target.value)}>
        {optionList.map(o => <option key={o}>{o}</option>)}
      </select>
    </label>
  );

  return [state, Dropdown, setState, setOptionList];
};

export default useDropdown;
