var config = {
    apiKey: "AIzaSyD2E2uGrRxUfKaUKaEJXee9VlCTG8PRTCk",
    authDomain: "proyecto-demo-82b64.firebaseapp.com",
    databaseURL: "https://proyecto-demo-82b64.firebaseio.com",
    storageBucket: "proyecto-demo-82b64.appspot.com",
    messagingSenderId: "87622763609"
  };
  firebase.initializeApp(config);

var led = document.getElementById('led'),
      els = led.childNodes,
    uid=0, size=15, w=0, h=0, row=0, col=0,
    arr_lights=[];

var hh = document.getElementById('time-hh'),
      hx = document.getElementById('time-h'),
      mm = document.getElementById('time-mm'),
      mx = document.getElementById('time-m'),
      ss = document.getElementById('time-ss'),
      sx = document.getElementById('time-s');

for(var k=0, len=els.length; k<len; k++){
  if(els[k].nodeType!=1)
    continue;
    w = parseInt(els[k].clientWidth);
  h = parseInt(els[k].clientHeight);
  row   = parseInt(h/size);
    col = parseInt(w/size);

  var t, l, sum=0;
  for(var i=0; i<row; i++){
    for(var j=0; j<col; j++){
      uid++;
      t = size*i;
      l = size*j;
      arr_lights.push( '<div uid="'+uid+'" id="l-'+uid+'" class="light row-'+i+' col-'+j+'" style="top:'+t+'px;left:'+l+'px"></div>');
    }
  }
  els[k].innerHTML = arr_lights.join("");
  arr_lights=[];
}

setInterval(function(){
    var now = new Date(),
        time_hh = parseInt(now.getHours()),
          time_mm = parseInt(now.getMinutes()),
            time_ss = parseInt(now.getSeconds());
    hh.className = "block-digital num-"+parseInt(time_hh/10);
    hx.className = "block-digital num-"+parseInt(time_hh%10);
    mm.className = "block-digital num-"+parseInt(time_mm/10);
    mx.className = "block-digital num-"+parseInt(time_mm%10);
    ss.className = "block-digital num-"+parseInt(time_ss/10);
    sx.className = "block-digital num-"+parseInt(time_ss%10);

}, 1000);

const msg01="Has madrugado, te mereces un premio";
const msg02="Llegaste a la hora";
const msg03="Has llegado tarde";

$(document).ready(function(){
	$('#nombre').on('keypress', function(e){
		console.log(e.which);
	});
});

function getOrigin(){
	return $('#nombre').val();
}

function getHoraIng(){
  return $('#hora').val(); 
}

function getMinutoIng(){
  return $('#minuto').val(); 
}

function  getMessage(){
  var mingreso=parseInt(getHoraIng())*60+parseInt(getMinutoIng());
  var mllegada=parseInt(getHour())*60+parseInt(getMinute());
  console.log("minutos Ingreso "+mingreso);
  console.log("minutos llegada "+mllegada);
  if(mingreso+15<mllegada){
    return msg03;  
  }else if(mingreso<mllegada){
    return msg02;
  }else{
    return msg01;
  }
  
}

function storeMessage(origin,message){
  console.log('Origin'+origin);
  console.log('Mensaje'+message);
	firebase.database().ref(
		'asistencia/'+origin
		).set({
			mensaje : message
		});
}

function storeIngreso(origin){
  console.log('Origin'+origin);
  firebase.database().ref(
    'asistencia/'+origin+'/entrada'
    ).set({
      hora : getHoraIng(),
      minuto : getMinutoIng()
    });
}

function storeLlegada(origin){
  console.log('Origin'+origin);
  firebase.database().ref(
    'asistencia/'+origin+'/llegada'
    ).set({
      hora : getHour(),
      minuto : getMinute()
    });
}

$(document).ready(function(){
	$('#nombre').on('keypress',function(e){
		if(e.which==13){
			storeMessage(getOrigin(),getMessage());
      storeIngreso(getOrigin());
      storeLlegada(getOrigin());
		} 
	});
});

function getHour() {
	return hh.className.slice(-1)+hx.className.slice(-1);
}

function getMinute(){
	return mm.className.slice(-1)+mx.className.slice(-1);
}


//autocompletar
$(document).ready(function(){
    $('#tags').on('keypress',function(e){
        console.log(e.which+"-"+e.key);
    });
});

function getAutoCompleteElements(substring){
    var val = substring;
    var i=0;
    var names = [];
    firebase.database().ref('asistencia/').on('value', function(snapshot){
        for(key in snapshot.val()){
            if(key.indexOf(val)>-1){
               if(i<5){
                   names.push(key);
                   i++;
               }
            }
        }
        loadAutoComplete(names);
    });
}

function loadForm(data){
    firebase.database().ref('asistencia/'+data).on('value', function(snapshot){
      var data = snapshot.val();
      setDataInfoHTML(data);
    });
}


$(document).ready(function(){
    $('#tags').on('keyup',function(e){
         if(e.which==13){
              loadForm($(this).val());
         }else{
             getAutoCompleteElements($(this).val());
         }
    });
});

function loadAutoComplete(data){
    $("#tags").autocomplete({
      source : data,
    });
}

function setDataInfoHTML(data){
  $("#mensaje").val(data.mensaje);
}