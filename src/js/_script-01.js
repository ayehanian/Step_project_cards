class Modal {
  constructor(overlay) {
    this.overlay = overlay;
    const closeButton = overlay.querySelector('.button-close');
    closeButton.addEventListener('click', this.close.bind(this));
    overlay.addEventListener('click', e => {
      if (e.id === this.overlay.id) {
        this.close();
      }
    });
  }

  close() {
    this.overlay.classList.add('is-hidden');
  }

  open() {
    const removeForm = document.getElementsByClassName('doctor-select-form');
    if (removeForm.length === 1) {
      removeForm[0].remove();
    }
    this.overlay.classList.remove('is-hidden');
  }
}

class Select {
  constructor(name, id, width, ...value) {
    this._name = name;
    this._id = id;
    this._width = width;
    this._value = value;
  }

  render(wrapper) {
    const select = document.createElement('select');
    select.id = this._id;
    select.setAttribute('name', this._name);
    select.classList.add('form-control', this._width, 'my-2');
    this._value.forEach((item, i) => {
      const option = document.createElement('option');
      option.setAttribute('value', item);
      option.innerText = item;
      select.append(option)
    });
    wrapper.appendChild(select)
  }
}

class Visit {
  constructor(data) {
    // this._data = data;
    // this._status = null;
    this._fullName = null;
    this._doctor = null;
    this._card = null;
    this._status = 'open';
    this._status = data['status-select'] = 'open';
    this._visit = data['title'];
    // this.title = data['title'] = this._visit;
    this._description = data['description'];
    this._priority = data['priority-select'];
    this._fullName = data['full-name'];
    this._info = null;
    this._doctor = '';
    this._id = data['id'];
    this._icon = ['icon.png', 'icon2.png', 'icon3.png'];
    // this.postCard(data).then(response => response).then(result => this._id = result)
  }

  render(wrapper) {
    this._card = document.createElement("div");
    this._card.classList.add('drag-card', 'card', 'm-3', 'bg-dark', 'align-self-start', 'draggable-item');
    this._card.setAttribute('draggable', 'true');
    this._card.id = this._id;

    this._card.innerHTML = `
       <div class="card-body text-white text-center ${this._status}-card ${this._priority.toLowerCase()}-priority">
         <h3 class="card-title"><span class="text-info d-inline-block w-100">Full Name: </span>${this._fullName}</h3>
         <h5 class="card-title"><img class="card-logo mr-2 rounded-circle"><span class="text-info">Doctor: </span>${this._doctor}</h5>
         <div class="additional-info is-hidden" id="additional-info"></div>
           <button class="show-more btn btn-success m-2" >Show more</button>
           <button class="btn btn-primary m-2 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="dropdownMenuButton" >Edit</button>
             <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
               <button class="dropdown-item update-card" onclick="openModal()">Edit</button>
               <button class="dropdown-item delete-card" >Delete</button>
               <button class="dropdown-item change-status" >Finish</button>
             </div>
         </div>`;
    const updateBtn = this._card.querySelector('.update-card');
    const modalVisitUpdate = new Modal(document.getElementById('update-card-modal'));
    updateBtn.openModal = modalVisitUpdate.open.bind(modalVisitUpdate);
    wrapper.insertAdjacentElement('afterbegin', this._card);

    const dragLink = document.querySelectorAll(".draggable-item");
    dragLink.forEach(item => {
      item.addEventListener("dragstart", drag);
    });

    // visitArr.push(this._card);

    this._card.addEventListener('click', (event) => {
    if (event.target.classList.contains("update-card")) {
     console.log('We need to update card');
      } else if (event.target.classList.contains("delete-card")) {
      this.deleteCard(this._id)
      }
  });
  }

  deleteCard(id){
    return new Promise((resolve, reject) => {
      const authOptions = {
        method: 'DELETE',
        url: `cards/${id}`,
      }
      axios(authOptions).then((response) => {
        resolve(response);
      })
          .catch((error) => {
            reject(error);
          });
    }).then(response => {
      console.log(response);
    })
  }


  updateStatus(status) {
    const bodyCard = this._card.querySelector('.card-body');
    bodyCard.classList.remove(`${this._status}-card`);
    this._status = 'close';
    bodyCard.classList.add(`${this._status}-card`);
  }

  visitEdit() {
    const newForm = new Form(this._card._id, ...args);
  }


  // postCard(data) {
  //   return new Promise((resolve, reject) => {
  //     axios.post('cards', data,)
  //         .then((response) => {
  //           resolve(response.data.id);
  //         })
  //         .catch((error) => {
  //           reject(error);
  //         });
  //   })
  // }

}

function allowDrop(e) {
  e.preventDefault();
}
function drag(e) {
  e.dataTransfer.setData('text', e.target.id)
}
function drop(e) {
  e.preventDefault();
  const data = e.dataTransfer.getData('text');
  this.appendChild(document.getElementById(data))
}
const dragContainer = document.getElementById('card-container');

dragContainer.addEventListener("drop", drop);
dragContainer.addEventListener("dragover", allowDrop);

class VisitCardio extends Visit {
  constructor(data, ...classArr) {
    super(data);
    this._doctor = data['cardio-select'];
    this._pressure = data['pressure'];
    this._weightIndex = data['weight-index'];
    this._diseases = data['diseases'];
    this._age = data['age'];
    this._class = classArr;
  }

  render(wrapper) {
    super.render(wrapper);
    this._card.querySelector('.card-logo').setAttribute('src', "/img/icon2.png");
    this._card.addEventListener('click', (event) => {
      if (event.target.classList.contains("show-more")) {
        if (event.target.textContent === 'Hide') {
          event.target.textContent = 'Show more'
        } else {
          event.target.textContent = 'Hide'
        }
        const cardContent = this._card.querySelector('.additional-info');
        cardContent.classList.toggle('is-hidden');
        cardContent.innerHTML = `<div><span class="text-info">Pressure: </span>${this._pressure}</div>
                       <div><span class="text-info">Weight Index: </span>${this._weightIndex}</div>
                       <div><span class="text-info">Diseases: </span>${this._diseases}</div>
                       <div><span class="text-info">Age: </span>${this._age}</div>`
      } else if (event.target.classList.contains("update-card")) {
        if (document.getElementsByClassName('update-form').length === 1) {
          document.getElementsByClassName('update-form')[0].remove();
        }
        const updateForm = new CardioForm('PUT', '', 'update-form');
        updateForm.render(document.querySelector("#card-update"));
      } else if (event.target.classList.contains("delete-card")) {
        this._card.remove();
      } else if (event.target.classList.contains("change-status")) {
        this.updateStatus(this._status);
      }
    });
  }
}

class VisitDentist extends Visit {
  constructor(data) {
    super(data);
    this._doctor = data['dantist-select'];
    this._date = data['date'];
  }

  render(wrapper) {
    super.render(wrapper);
    this._card.querySelector('.card-logo').setAttribute('src', "/img/icon.png");
    this._card.addEventListener('click', (event) => {
      if (event.target.classList.contains("show-more")) {
        const cardContent = this._card.querySelector('.additional-info');
        cardContent.classList.toggle('is-hidden');
        cardContent.innerHTML = `<div><span class="text-info">Date: </span>${this._date}</div>`
      } else if (event.target.classList.contains("update-card")) {
        if (document.getElementsByClassName('update-form').length === 1) {
          document.getElementsByClassName('update-form')[0].remove();
        }
        const updateForm = new DantistForm('PUT', '', 'update-form');
        updateForm.render(document.querySelector("#card-update"));
      } else if (event.target.classList.contains("delete-card")) {
        this._card.remove();
      } else if (event.target.classList.contains("change-status")) {
        this.updateStatus(this._status);
      }
    });
    // const updateBtn = this._card.querySelector('.update-card');
    // const modalVisitUpdate = new Modal(document.getElementById('update-card-modal'));
    // updateBtn.openModal = modalVisitUpdate.open.bind(modalVisitUpdate);
    // const updateForm = new DantistForm(modalVisitUpdate);
    // updateForm.render(document.querySelector("#card-update"));
  }

}



class VisitTherapist extends Visit {
  constructor(data) {
    super(data);
    this._doctor = data['therapist-select'];
    this._age = data['age'];
  }

  render(wrapper) {
    super.render(wrapper);
    this._card.querySelector('.card-logo').setAttribute('src', "/img/icon3.png");
    // const updateBtn = this._card.querySelector('.update-card');
    // const modalVisitUpdate = new Modal(document.getElementById('update-card-modal'));
    // updateBtn.openModal = modalVisitUpdate.open.bind(modalVisitUpdate);
    this._card.addEventListener('click', (event) => {
      if (event.target.classList.contains("show-more")) {
        const cardContent = this._card.querySelector('.additional-info');
        cardContent.classList.toggle('is-hidden');
        cardContent.innerHTML = `<div><span class="text-info">Age: </span>${this._age}</div>`
      } else if (event.target.classList.contains("update-card")) {
        if (document.getElementsByClassName('update-form').length === 1) {
          document.getElementsByClassName('update-form')[0].remove();
        }
        const updateForm = new TherapistForm('PUT', '', 'update-form');
        updateForm.render(document.querySelector("#card-update"));
      } else if (event.target.classList.contains("delete-card")) {
        this._card.remove();
      } else if (event.target.classList.contains("change-status")) {
        this.updateStatus(this._status);
      }
    });

  }
}