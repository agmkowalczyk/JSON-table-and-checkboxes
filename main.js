const url = 'https://agmkowalczyk.github.io/JSON-table-and-checkboxes/';
let state = [],
    lastPage = '';

function getData(input = 'page1') {
  lastPage = input;
  
  const isExist = state.some( el => el.page === input );
  if (isExist === false) {
    
    let file;
    switch (input) {
      case 'page1' : file = 'data_p1.txt'; break;
      case 'page2' : file = 'data_p2.txt'; break;
      case 'page3' : file = 'data_p3.txt'; break;
      case 'page4' : file = 'data_p4.txt'; break;
    }

    $.getJSON(url + file, data => {
      let newRows = [];
      data.rows.forEach(dataRow => {
        const row = {
          ...dataRow,
          'done': false
        }
        newRows.push(row);
      });

      state.push({ 'page': input,
                   'rows': newRows });
      createTbody();
    })
    .fail(() => {
      $('tbody').empty();
      alert ( 'Request failed!' );
    });

  } else {
    createTbody();
  }
}

function createTbody() {
  $('tbody').empty();
  const pageIdx = state.findIndex( el => el.page === lastPage );
  state[pageIdx].rows.forEach( item => {
    const row = `
      <tr>
        <td><input type="checkbox" id='${ item.id }' ${ item.done === false ? '' : 'checked' }></td>
        <td>${ item.id }</td>
        <td>${ item.first_name }</td>
        <td>${ item.last_name }</td>
        <td>${ item.email }</td>
      </tr>
    `;
    $('tbody').append(row);
  });

  $(':checkbox:first').prop('checked', false);
  isAllChecked();  
}

function toggleDone(e) {
  const pageIdx = state.findIndex( el => el.page === lastPage );
  const doneRow = state[pageIdx].rows;
  const doneIdx = doneRow.findIndex( el => el.id == e.target.id ); 
  doneRow[doneIdx].done = !doneRow[doneIdx].done;

  isAllChecked();
}

function isAllChecked() {
  if ($('tbody :checkbox:checked').length == $('tbody :checkbox').length) {
    $(':checkbox:first').prop('checked', true);
  } else {
    $(':checkbox:first').prop('checked', false);
  }
}

function toggleAll() {
  const pageIdx = state.findIndex( el => el.page === lastPage );
  state[pageIdx].rows.forEach( el => {
    el.done = !el.done;
  });

  if ($(':checkbox:first').is(':checked')) {
    $(':checkbox:not(:first)').prop('checked', true);
  } else {
    $(':checkbox:not(:first)').prop('checked', false);
  }
};

$(function(){
  getData();

  $('button').click( e => getData(e.target.id) );
  $('tbody').change(':checkbox', e => toggleDone(e) );
  $(':checkbox:first').click( () => toggleAll() );
});
