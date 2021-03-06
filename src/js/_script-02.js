class Input {
  constructor(type = 'text', placeholder = '', name ='', value='', id = '', required = 'required', ...classArr){
    this._type = type;
    this._placeholder = placeholder;
    this._id = id;
    this._classArr = classArr;
    this._value = value;
    this._name = name;
    this._required = required;
  }
  render(container) {
    const input = document.createElement("input");
    input.id = this._id;
    input.className = this._classArr.join(" ");
    input.placeholder = this._placeholder;
    input.type = this._type;
    input.value = this._value;
    input.name = this._name;
    input.required = this._required;
    // if (input.type === 'submit' || input.type === 'button') {
    //   input.className = 'btn btn-primary';
    // } else {
    //   input.className = 'form-control';
    // }

    container.appendChild(input);
  }

//   updateInput() {
//    this._placeholder = this._value
// }
}