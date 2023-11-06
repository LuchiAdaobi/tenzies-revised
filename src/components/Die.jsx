export default function Die(props) {
  // const styles = {
  //     background : props.is
  // }
  return (
    <section>
      <div
        className={props.isHeld ? "die-held" : "die"}
        onClick={props.holdDice}
      >
        {props.value}
      </div>
    </section>
  );
}
