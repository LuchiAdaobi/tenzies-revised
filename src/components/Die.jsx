export default function Die(props) {
  return (
    <section>
      <div
        className={`${props.isHeld ? "die-held" : "die"} ${
          props.notSameTenzies && props.value !== props.majorityValue ? "redBackground" : ""
        }`}
        onClick={props.holdDice}
      >
        {props.value}
      </div>
    </section>
  );
}

// ${
        //   props.isHeld && props.notTenzies ? "redBackground" : ""