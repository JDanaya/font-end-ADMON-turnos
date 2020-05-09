import React, { useState, useEffect } from 'react';
import './styles.css';
import imgi from './itsaW.png'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'; 
import Typing from 'react-typing-animation';
import FadeIn from 'react-fade-in';
import { useToasts } from 'react-toast-notifications'
import axios from 'axios'
axios.defaults.timeout = 20000 //tiempo permitido de respuesta
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'DELETE, POST, GET, OPTIONS'
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, Accept'
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
const BASE_URL= 'https://iturn20.herokuapp.com/api';

function Login_admon(){

    const { addToast } = useToasts()

  const [next, setNext] = useState(false)
  const [show, setShow] = useState(false)
  const [moduleSeleccionado, setModuleSeleccionado] = useState(1)
  const [verde1,setVerde1] = useState(false)
  const [verde11,setVerde11] = useState(false)
  const [verde21,setVerde21] = useState(false)
  const [verde31,setVerde31] = useState(false)
  const [contadorAD, setContadorAD] = useState(0)
  const [contadorGN, setContadorGN] = useState(0)
  const [contadorFC, setContadorFC] = useState(0)
  const [contadorID, setContadorID] = useState(0)
  const [contadorAfluencia, setContadorAfluencia] = useState(0)
  const [diaAfluencia, setDiaAfluencia] = useState('')
  const [person, setPerson] = useState('--')
  const [personAD, setPersonAD] = useState({
      first_name: '--',
      last_name: '',
      email: '--',
      phone: '--',
      password: '--',
      id_category: 1
  })
  const [personGN, setPersonGN] = useState(
      {
        first_name: '--',
        last_name: '',
        email: '--',
        phone: '--',
        password: '--',
        id_category: 11
      }
  )
  const [personFC, setPersonFC] = useState(
    {
        first_name: '--',
        last_name: '',
        email: '--',
        phone: '--',
        password: '--',
        id_category: 21
    }
  )
  const [personID, setPersonID] = useState(
    {
        first_name: '--',
        last_name: '',
        email: '--',
        phone: '--',
        password: '--',
        id_category: 31
    }
  )
    useEffect( ()=>{
        handleLogin()
        handleAfluencia()
    },[])

    useEffect( ()=>{
      handleContadores(1)
      handleContadores(11)
      handleContadores(21)
      handleContadores(31)
      setInterval(()=>{
        handleContadores(1)
        handleContadores(11)
        handleContadores(21)
        handleContadores(31)
      },180000)
        setPerson(localStorage.getItem('person'));
    },[next])


    const showVerde1 = ()=> {
      setVerde1(true)
      setTimeout( ()=>{
        setVerde1(false)
      },1500 )
    }
    const showVerde11 = ()=> {
      setVerde11(true)
      setTimeout( ()=>{
        setVerde11(false)
      },1500 )
    }
    const showVerde21 = ()=> {
      setVerde21(true)
      setTimeout( ()=>{
        setVerde21(false)
      },1500 )
    }
    const showVerde31 = ()=> {
      setVerde31(true)
      setTimeout( ()=>{
        setVerde31(false)
      },1500 )
    }

    const handleContadores = (categories)=>{

        // Get data
        var dataUser = localStorage.getItem('iturnUser');
        var dataPassword = localStorage.getItem('iturnPassword');
        axios.post(BASE_URL+'/admin/totalbycategory', {
            user: dataUser,
            password: dataPassword,
            category: categories
          })
          .then(function (response) {
            console.log(response.data);

            if(categories===1){
                setContadorAD(response.data.data[0].Total_turnos_pendientes)
                showVerde1()
            }
            if(categories===11){
                setContadorGN(response.data.data[0].Total_turnos_pendientes)
                showVerde11()
            }
            if(categories===21){
                setContadorFC(response.data.data[0].Total_turnos_pendientes)
                showVerde21()
            }
            if(categories===31){
                setContadorID(response.data.data[0].Total_turnos_pendientes)
                showVerde31()
            }

            return
    
          })
          .catch(function (error) {
            console.log(error)
            return showNotify('algo salio mal', 'warning')
          });
    }

    const handleAfluencia = (categories)=>{

      axios.get(BASE_URL+'/admin/diamayorafluencia',null)
        .then(function (response) {
          console.log(response.data);
          setContadorAfluencia(response.data.data.cantidad)
          setDiaAfluencia(response.data.data.dia)
        
        })
        .catch(function (error) {
          console.log(error)
          return showNotify('algo salio mal', 'warning')
        });
  }

    const handleNextTurn = (moduleTurn) =>{
         // Get data
         var dataUser = localStorage.getItem('iturnUser');
         var dataPassword = localStorage.getItem('iturnPassword');
         axios.post(BASE_URL+'/admin/turn', {
             user: dataUser,
             password: dataPassword,
             module: moduleTurn
           })
           .then(function (response) {
             console.log(response.data);
 
             if(response.data.data[0].id_category===1){
                handleContadores(response.data.data[0].id_category)
                setPersonAD(response.data.data[0])
             }
             if(response.data.data[0].id_category===11){
                handleContadores(response.data.data[0].id_category)
                setPersonGN(response.data.data[0])
             }
             if(response.data.data[0].id_category===21){
                handleContadores(response.data.data[0].id_category)
                setPersonFC(response.data.data[0])
             }
             if(response.data.data[0].id_category===31){
                handleContadores(response.data.data[0].id_category)
                setPersonID(response.data.data[0])
             }
 
             return
     
           })
           .catch(function (error) {
             console.log(error)
             return showNotify('algo salio mal', 'warning')
           }); 
    }

  const handleLogin = ()=> {
    // Get data
    var dataUser = localStorage.getItem('iturnUser');
    var dataPassword = localStorage.getItem('iturnPassword');

    if(dataUser && dataPassword){
        //handle next app
        setNext(true)
    }
  }

  const showNotify = (data, type)=>{
    return addToast(data, {
        appearance: type,
        autoDismiss: true,
      })
  }

  const handleExit = ()=> {
      //handle clear local storege
      window.localStorage.clear()
      return setNext(false)
  }

  const handleSubmit = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const userg = event.target.formBasicEmail.value;
      const passwordg = event.target.formBasicPassword.value;

      axios.post(BASE_URL+'/loginAdmin', {
        user: userg,
        password: passwordg
      })
      .then(function (response) {
        console.log(response.data);

        if(response.data.data[0]){
            console.log(response.data.data[0].id_user)
            if(response.data.data[0].id_user){
                localStorage.setItem('iturnUser', userg);
                localStorage.setItem('iturnPassword', passwordg);

                const auxPerson = `${response.data.data[0].first_name} ${response.data.data[0].last_name}`
                localStorage.setItem('person', auxPerson)
                return setNext(true)
            }
        }
       
        return showNotify(response.data.data, 'warning')

      })
      .catch(function (error) {
          console.log(error)
        return showNotify('algo salio mal', 'warning')
      });
    

  };

  const AnimatedTypingComponent = (
    <Typing cursorClassName="text-light" onFinishedTyping={ () => {
      setShow(true)
    }} speed={80} className=" text-light text-left txtbl pr-5 mt-5" >
      <span>Bienvenido a la plataforma del administrador</span>
    </Typing>
  ) 

  const LoginComponent = (
    <Row>
        
      <Col className="box1" xl={7} lg={6} md={5} sm={6} xs={12}>
        {AnimatedTypingComponent}
       {
         
          
          show ? (
            <FadeIn>
              <img
                className="d-block  itsa"
                src={imgi}
                alt="First slide"
              />
            </FadeIn>
          ): null
        }
   }
        
                
      </Col>

      <Col className="box2" xl={5} lg={6} md={7} sm={6} xs={12}>
        
        <p className="textTop text-left ">
          <b>iTurn</b> 
        </p>

        <p className="textDown text-left text-light">
          A continuacion podras ingresar tu id & contraseña creada con anterioridad 
        </p>
        
        <Form className="frm"  onSubmit={handleSubmit}>
        <FadeIn>
          <Form.Group className="left"  controlId="formBasicEmail">
            <Form.Label className="text-light txtEmail"> Correo electronico </Form.Label>
            <Form.Control className="btnEmail" type="email" placeholder="Ingresa tu correo" />
          </Form.Group>

          <Form.Group className="left" controlId="formBasicPassword">
            <Form.Label className="text-light txtPassword"> Contraseña</Form.Label>
            <Form.Control className="btnPassword" type="password" placeholder="Ingresa contraseña" />
          </Form.Group>

          <Button className="leftButtonl"  variant="light" size="sm" type="submit">
            <b>Ingresar</b> 
          </Button>
        </FadeIn>
       
      </Form>

      </Col>

    </Row>
  ) 
  const AdmonComponent = (
    <FadeIn>
    <div className="wrap">
        <Row>
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <p className="txtsalir text-right text-light pt-3 pb-3 mb-2 pr-4">Bienvenid@, {person} - <b onClick={ handleExit }> Salir</b></p> 
        </Col>
        </Row>
        <div className="category">
         <Row >
        <Col  xl={3} lg={3} md={3} sm={6} xs={6}>
            <h4 className=" text-light" style={{backgroundColor: verde1 ? 'green' : '#1F295A'}}>
                Admisiones
            </h4>
        </Col>
        <Col  xl={3} lg={3} md={3} sm={6} xs={6}>
            <h4 className=" text-light  " style={{backgroundColor: verde11 ? 'green' : '#1F295A'}}>
                General
            </h4>
        </Col>   
        <Col  xl={3} lg={3} md={3} sm={6} xs={6}>
            <h4 className=" text-light " style={{backgroundColor: verde21 ? 'green' : '#1F295A'}}>
                Facultad
            </h4>
        </Col>  
        <Col  xl={3} lg={3} md={3} sm={6} xs={6}>
            <h4 className=" text-light" style={{backgroundColor: verde31 ? 'green' : '#1F295A'}}>
                Idiomas
            </h4>
        </Col>     
             
    </Row>
    </div>
    <div className="people">
         <Row >
        <Col  xl={3} lg={3} md={6} sm={12} xs={12}>
            <div className=" sec1 text-light pt-1" style={{backgroundColor: verde1 ? 'green' : '#1F295A'}}>
                <p>
                    AD-{contadorAD}
                </p>
                <hr/>
                <Row className="topctext">
                 <Col xl={12} lg={12} md={12} sm={12} xs={12}><p className="txtup text-left pt-2 pl-2">Informacion personal </p> </Col> 
                 <hr/>
                <Col xl={4} lg={5} md={5} sm={6} xs={6}><p className="txt1 text-left pt-2 pl-2">Nombre: </p> </Col> 
                <Col xl={8} lg={7} md={7} sm={6} xs={6}><p className="txt1r text-left pt-2 ">{`${personAD.first_name} ${personAD.last_name}`}</p></Col> 

                <Col xl={4} lg={6} md={6} sm={6} xs={6}><p className="txt2 text-left pl-2">Celular: </p> </Col> 
                <Col xl={8} lg={6} md={6} sm={6} xs={6}><p className="txt2r text-left">{personAD.phone}</p></Col>  

                <Col xl={4} lg={6} md={6} sm={6} xs={6}><p className="txt3 text-left pl-2">Correo: </p> </Col> 
                <Col xl={8} lg={6} md={6} sm={6} xs={6}><p className="txt3r text-left ">{personAD.email}</p></Col> 
            </Row>
            </div>
        </Col>
        <Col  xl={3} lg={3} md={6} sm={12} xs={12}>
        <div className=" sec2 text-light pt-1" style={{backgroundColor: verde11 ? 'green' : '#1F295A'}}>
                <p>
                    GN-{contadorGN}
                </p>
                <hr/>
                <Row className="topctext">
                 <Col xl={12} lg={12} md={12} sm={12} xs={12}><p className="txtup text-left pt-2 pl-2">Informacion personal </p> </Col> 
                 <hr/>
                <Col xl={4} lg={5} md={5} sm={6} xs={6}><p className="txt1 text-left pt-2 pl-2">Nombre: </p> </Col> 
                <Col xl={8} lg={7} md={7} sm={6} xs={6}><p className="txt1r text-left pt-2 ">{`${personGN.first_name} ${personGN.last_name}`}</p></Col> 

                <Col xl={4} lg={6} md={6} sm={6} xs={6}><p className="txt2 text-left pl-2">Celular: </p> </Col> 
                <Col xl={8} lg={6} md={6} sm={6} xs={6}><p className="txt2r text-left">{personGN.phone}</p></Col>  

                <Col xl={4} lg={6} md={6} sm={6} xs={6}><p className="txt3 text-left pl-2">Correo: </p> </Col> 
                <Col xl={8} lg={6} md={6} sm={6} xs={6}><p className="txt3r text-left ">{personGN.email}</p></Col> 
            </Row>
            </div>
        </Col>   
        <Col  xl={3} lg={3} md={6} sm={12} xs={12}>
        <div className=" sec3 text-light pt-1" style={{backgroundColor: verde21 ? 'green' : '#1F295A'}}>
                <p>
                    FC-{contadorFC}
                </p>
                <hr/>
                <Row className="topctext">
                 <Col xl={12} lg={12} md={12} sm={12} xs={12}><p className="txtup text-left pt-2 pl-2">Informacion personal </p> </Col> 
                 <hr/>
                <Col xl={4} lg={5} md={5} sm={6} xs={6}><p className="txt1 text-left pt-2 pl-2">Nombre: </p> </Col> 
                <Col xl={8} lg={7} md={7} sm={6} xs={6}><p className="txt1r text-left pt-2 ">{`${personFC.first_name} ${personFC.last_name}`}</p></Col> 

                <Col xl={4} lg={6} md={6} sm={6} xs={6}><p className="txt2 text-left pl-2">Celular: </p> </Col> 
                <Col xl={8} lg={6} md={6} sm={6} xs={6}><p className="txt2r text-left">{personFC.phone}</p></Col>  

                <Col xl={4} lg={6} md={6} sm={6} xs={6}><p className="txt3 text-left pl-2">Correo: </p> </Col> 
                <Col xl={8} lg={6} md={6} sm={6} xs={6}><p className="txt3r text-left ">{personFC.email}</p></Col> 
            </Row>
            </div>
            
        </Col>  
        <Col  xl={3} lg={3} md={6} sm={12} xs={12}>
        <div className=" sec4 text-light pt-1" style={{backgroundColor: verde31 ? 'green' : '#1F295A'}}>
                <p>
                    ID-{contadorID}
                </p>
                <hr/>
                <Row className="topctext">
                 <Col xl={12} lg={12} md={12} sm={12} xs={12}><p className="txtup text-left pt-2 pl-2">Informacion personal </p> </Col> 
                 <hr/>
                <Col xl={4} lg={5} md={5} sm={6} xs={6}><p className="txt1 text-left pt-2 pl-2">Nombre: </p> </Col> 
                <Col xl={8} lg={7} md={7} sm={6} xs={6}><p className="txt1r text-left pt-2 ">{`${personID.first_name} ${personID.last_name}`}</p></Col> 

                <Col xl={4} lg={6} md={6} sm={6} xs={6}><p className="txt2 text-left pl-2">Celular: </p> </Col> 
                <Col xl={8} lg={6} md={6} sm={6} xs={6}><p className="txt2r text-left">{personID.phone}</p></Col>  

                <Col xl={4} lg={6} md={6} sm={6} xs={6}><p className="txt3 text-left pl-2">Correo: </p> </Col> 
                <Col xl={8} lg={6} md={6} sm={6} xs={6}><p className="txt3r text-left ">{personID.email}</p></Col> 
            </Row>
            </div>
        </Col>     
             
    </Row>
    </div>
        
       <div className="buttom">
           <Row>
            <Col  xl={6} lg={6} md={6} sm={6} xs={6}>
            <div >
                    <p className="text-light">
                       Dia con mayor afluencia {diaAfluencia} con {contadorAfluencia} turnos
                    </p>
                </div>
            </Col>
            <Col  xl={6} lg={6} md={6} sm={6} xs={6}>
                <div >
                    <Button className="buttom1 " variant="secondary" onClick={ ()=> handleNextTurn(moduleSeleccionado)}>Siguiente turno</Button>{' '}
                </div>
            </Col>
            </Row>
        </div>
   
    

    {/* 
    
        <Row  className=" txtButton text-left">
            <Col  xl={12} lg={12} md={12} sm={12} xs={12}>
            <Button variant="secondary">Secondary</Button>{' '}
            </Col>
            <Col  xl={12} lg={12} md={12} sm={12} xs={12}>
            <Button variant="secondary">Secondary</Button>{' '}
            </Col>           
        </Row>
    </div>
    */}
    
</div>
</FadeIn>
)
  return(
    <div className="grandf">
    <div className="father">
    <Container className="fill">
    {
      next ? AdmonComponent : LoginComponent 
    }
    </Container>
    </div>
    </div>
  );
}

export default Login_admon