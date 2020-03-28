import React, { useState, useEffect } from 'react';
import './App.css';
import {Container, Navbar, Alert, Button, Table, NavDropdown, Form, FormControl, Nav, Jumbotron} from 'react-bootstrap';
import virus from './data/bacteria.svg';



function App() {
  const [show, setShow] = useState(true);

  var today = new Date();

  const[date] = useState(today.getFullYear() + '-' +  (today.getMonth() + 1) + '-' + today.getDate());

  const[time] = useState((today.getHours()) + ':' + today.getMinutes() + ':' + today.getSeconds());

  const[casesByCountry, setCasesByCountry] = useState([]);

  const [viewPort, setViewPort] = useState({
    latitude: 43.6532,
    longitude: 79.3832,
    zoom: 10,
    width: '85%',
    height: '800px'
  });

  const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

  const[countrySearch, setCountrySearch] = useState("")

  const handleTextChange = event => {
    setCountrySearch(event.target.value);
  }

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  useEffect(() =>{
    fetch("https://api.covid19api.com/summary", requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result.Countries){
        setCasesByCountry([...casesByCountry, ...result.Countries]);
      }
    })
  }, []);

  function totalCases() {
    var total = 0;
    casesByCountry.map((country) =>{
      total = total + country.TotalConfirmed;
    })
    return total;
  }

  function totalDeaths() {
    var total = 0;
    casesByCountry.map((country) =>{
      total = total + country.TotalDeaths;
    })
    return total;
  }

  function totalRecovered(){
    var total = 0;
    casesByCountry.map((country) =>{
      total = total + country.TotalRecovered;
    })
    return total;
  }

  function precentChange(stat1, stat2){
    if(stat1 === 0 || stat2 === 0){
      return "No Change"
    }
    if(stat1 === stat2){
      return "100%";
    }
    
    var percent = 0;
    var difference = 0;
    difference = stat1 - stat2;
    percent = (stat1/difference - 1) * 100;
    percent = parseFloat(percent.toFixed(2));

    if(percent > 0 && percent < Infinity){
       return percent + "%";
    }
    else{
       return "No Change";
    }
  }

  function getSortOrder(prop){
    return function(a,b){
      if(a.prop > b.prop){
        return 1;
      }
      else if(a.prop < b.prop){
        return -1;
      }
      else return 0;
    }
  }



  return (
    <div className="body-nav">
      <Navbar sticky="top" expand = "lg" style={{background:"#1F2833"}}>
        <img
          src = {virus}
          alt = "virus"
          style={{width: '90px', height:'90px', textAlign: 'left'}}
        />
        <Container>
          <Navbar.Brand style={{color:"#66FCF1", fontFamily:"'Righteous', cursive", fontSize:"2em", justifyContent:"left"}}>COVID-19 LIVE UPDATES</Navbar.Brand>
        </Container>
        <p className = "date">Date of update: {date}</p>
        <p className = "time">Time of update: {time}</p>
      </Navbar>
      <Alert variant= 'danger' show = {show}>
          If you are feeling ill and/or have recently traveled outside of Canada please contact a health care professional and self-isolate.       
          <div className="alert-button">
          <Button onClick={() => setShow(false)} variant="outline-danger">
              Understood.
          </Button>
          </div>                                     
      </Alert>
      <div className = "body">
          <h2 style={{justifyContent: "center", textAlign: "center", paddingTop: "2em", color: "#66FCF1", fontFamily:"'Righteous', cursive"}}>
            TotalConfirmed
          </h2>
          <h4 style={{justifyContent: "center", textAlign: "center", paddingTop: "2em", color: "#45A29E", fontFamily:"'Righteous', cursive"}}>{totalCases()}</h4>
          <h2 style={{justifyContent: "center", textAlign: "center", paddingTop: "3em", color: "#66FCF1", fontFamily:"'Righteous', cursive"}}>
            All-time Deaths
          </h2>
          <h4 style={{justifyContent: "center", textAlign: "center", paddingTop: "2em", color: "#45A29E", fontFamily:"'Righteous', cursive"}}>{totalDeaths()}</h4>
          <h2 style={{justifyContent: "center", textAlign: "center", paddingTop: "3em", color: "#66FCF1", fontFamily:"'Righteous', cursive"}}>
            All-time recoverd
          </h2>
          <h4 style={{justifyContent: "center", textAlign: "center", paddingTop: "2em", color: "#45A29E", fontFamily:"'Righteous', cursive"}}>{totalRecovered()}</h4>
      </div>
      <div className="country-Chart">
      <Navbar bg="dark" expand="lg">
        <Navbar.Brand style={{color: "#66FCF1", fontFamily:"'Righteous', cursive"}}>Cases By Country</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown style={{color: "#66FCF1", fontFamily:"'Righteous', cursive"}} title="Sort" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={casesByCountry.sort(getSortOrder("TotalConfirmed")).reverse()}>Highest Cases to Lowest</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={casesByCountry.sort(getSortOrder("TotalConfirmed")).reverse()} >Lowest Cases to Highest</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={casesByCountry.sort(getSortOrder("TotalDeaths")).reverse()}>Highest Deaths to Lowest</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={casesByCountry.sort(getSortOrder("TotalDeaths")).reverse()} >Lowest Deaths to Highest</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={casesByCountry.sort(getSortOrder("TotalRecovered")).reverse()}>Highest Recoveries to Lowest</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={casesByCountry.sort(getSortOrder("TotalRecovered")).reverse()}>Lowest Recoveries to Highest</NavDropdown.Item>
              <NavDropdown.Divider />
            </NavDropdown>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search by Country" className="mr-sm-2" onChange={handleTextChange} style={{color: "black", fontFamily:"'Righteous', cursive"}} />
          </Form>
        </Navbar.Collapse>
      </Navbar>

        <Table hover variant="dark" size="sm">
            <thead>
              <tr>
                <th>Country</th>
                <th>Total Cases</th>
                <th>Total New Cases</th>
                <th>Change in Cases(%)</th>
                <th>Total Deaths</th>
                <th>Total New Deaths</th>
                <th>Change in Deaths(%)</th>
                <th>Total Recoveries</th>
                <th>Total New Recoveries</th>
                <th>Change in Recoveries(%)</th>
              </tr>
            </thead>
            <tbody>
              {casesByCountry.map((country, index) =>{
                if(index != 0){
                  return(
                      <tr key={index}>
                        <td key={index}>{country.Country.toUpperCase()}</td>
                        <td key={index}>{country.TotalConfirmed}</td>
                        <td key={index}>{country.NewConfirmed}</td>
                        <td key={index}>{precentChange(country.TotalConfirmed, country.NewConfirmed)}</td>
                        <td key={index}>{country.TotalDeaths}</td>
                        <td key={index}>{country.NewDeaths}</td>
                        <td key={index}>{precentChange(country.TotalDeaths, country.NewDeaths)}</td>
                        <td key={index}>{country.TotalRecovered}</td>
                        <td key={index}>{country.NewRecovered}</td>
                        <td key={index}>{precentChange(country.TotalRecovered, country.NewRecovered)}</td>
                        <td></td>
                      </tr>
                  )
                }
              })}
            </tbody>
        </Table>
      </div>
      <Navbar style={{background:"#1F2833"}}>
        <img
          src = {virus}
          alt = "virus"
          style={{width: '90px', height:'90px', textAlign: 'left'}}
        />
        <Navbar.Brand style={{color:"#66FCF1", fontFamily:"'Righteous', cursive", fontSize:"2em", justifyContent:"left", paddingLeft:"1em"}}>COVID-19 LIVE UPDATES</Navbar.Brand>
        <Container>
          <p style={{color:"#66FCF1", fontFamily:"'Righteous', cursive", fontSize:"14px", textAllign:"right"}}>
            This website was designed and developed by Gurman Brar to provide insight and constant updates to the current global pandemic.
             If you wish to inquire more please visit the link below to my perosnal website. This website is not intended to be the original source of updates
            and fetches data from API sources. Please remember to stay safe and stay clean!
          </p>
          <Button variant="danger" style={{paddingLeft: '1em', textAlign: 'center'}} href="https://gurmanbrar.com">Click Here to Learn More</Button>
        </Container>
      </Navbar>
    </div>
  );
}

export default App;