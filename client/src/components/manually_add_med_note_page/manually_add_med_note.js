import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { addMedicalItem,readSessions } from "../../actions/";
import { Field, reduxForm } from "redux-form";

class AddMedNote extends Component {
  constructor(props) {
    super(props);
  }
    componentWillMount() {
        this.props.readSessions().then(()=>{
            // console.log('this is the current auth', this.props);
            if(!this.props.auth || this.props.vetAccess){
                this.props.history.push('/');
            }
        });
    }
  renderInput({ placeholder, label, input, type, meta: { touched, error, active } }) {
    return (
      <div className="form-group row">
        <label className="col-form-label">{label}</label>
        <input placeholder={placeholder} className="form-control" type={type} {...input}/>
        <p className="text-danger">{touched && !active && error}</p>
      </div>
    );
  }

  renderTextArea({ input, label, placeholder, meta: { touched, error, active } }) {
    return (
      <div className="form-group row">
        <label className="col-form-label">{label}</label>
        <textarea {...input} placeholder={placeholder} rows="6" className="form-control "/>
        <p className="text-danger">{touched && !active && error}</p>
      </div>
    );
  }

  handleSubmit(values) {
    const petId = this.props.match.params.id;
    this.props.addMedicalItem(petId, values).then(() => {
      this.props.history.push("/pet-profile/" + petId);
    })
  }

  render() {
    return (
      <div className="bodyContainer">
        <h1>Add Medical Record</h1>
        <form
          className="addMedRecContainer"
          onSubmit={this.props.handleSubmit(this.handleSubmit.bind(this))}
        >
          <Field
            name="title"
            label="Title"
            type="text"
            component={this.renderInput}
          />
          <Field name="date" label="Date" type="date" component={this.renderInput} />
          <Field
            name="message"
            label="Details"
            component={this.renderTextArea}
          />
          <div className="buttonContainer row">
            <button className="btn btn-success">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const error = {};
  if (!values.title) {
    error.title = "Please enter the title";
  }
  if(values.title !== undefined){
		if(!values.title.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)){
			error.title = "Please enter a valid title"
		}
	}
  if (!values.date) {
    error.date = "Passwords enter the date";
  }
  if (!values.message) {
    error.message = "Please enter the comment";
  }
  return error;
}

AddMedNote = reduxForm({
  form: "add-med-note",
  validate: validate
})(AddMedNote);

function mapStateToProps(state){
    return{
        vetAccess: state.sessions.vetAccess,
        auth: state.sessions.auth
    }
}

export default connect(mapStateToProps, { addMedicalItem, readSessions })(AddMedNote);
