import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class PetToVet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        vetEmail: "",
        vetRefNum: ""
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);


  }
  handleInputChange(e) {

    const { name, value } = e.target;
    const { form } = this.state;


    form[name] = value;
    this.setState({ form: { ...form } });
  }

  handleSubmit(e){
    e.preventDefault();

    const url = '/server/database_connect/server.php?action=post&resource=petVetConnect';
    axios({
        method: 'post',
        url: url,
        dataType: 'json',
        data: {
          vetEmail: this.state.form.vetEmail,
          refNum: this.state.form.vetRefNum,
          ownerID: 1,
          petID: 2,
        }
    }).then(function(res) {
      console.log(res.data);
    });

  }


  render() {
    const { vetEmail, vetRefNum } = this.state.form;
    return (
      <div>
        <div className="pictureContainer">
          <h2 className="text-center">Connect Pet To Vet</h2>
        </div>
        <form className="container" onSubmit={e => this.handleSubmit(e)}>
          <div className="form-group">
            <label>Vet Email</label>
            <input
              className="form-control input-lg"
              type="text"
              onChange={e => this.handleInputChange(e)}
              name="vetEmail"
              value={vetEmail}
            />
          </div>
          <div className="form-group">
            <label>Vet Ref #</label>
            <input
              className="form-control input-lg"
              type="text"
              onChange={e => this.handleInputChange(e)}
              name="vetRefNum"
              value={vetRefNum}
            />
          </div>
          <button className="btn btn-primary">Submit</button>
          <Link to='/pet-list' className='pull-right my-5'> Skip </Link>


        </form>
      </div>
    );
  }
}
