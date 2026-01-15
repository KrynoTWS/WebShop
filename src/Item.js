const Item = (props) => { 
    return (
    <div>
      <h1>{props.name}</h1>
      <h2>{props.type}</h2>
      <h3>{props.subtype}</h3>
    </div>
  );
}

export default Item;