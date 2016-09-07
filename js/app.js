(function(){


  var ranges = [
    {minrow: 0, maxrow: 3, mincol: 0, maxcol: 3},
    {minrow: 0, maxrow: 3, mincol: 3, maxcol: 6},
    {minrow: 0, maxrow: 3, mincol: 6, maxcol: 9},

    {minrow: 3, maxrow: 6, mincol: 0, maxcol: 3},
    {minrow: 3, maxrow: 6, mincol: 3, maxcol: 6},
    {minrow: 3, maxrow: 6, mincol: 6, maxcol: 9},

    {minrow: 6, maxrow: 9, mincol: 0, maxcol: 3},
    {minrow: 6, maxrow: 9, mincol: 3, maxcol: 6},
    {minrow: 6, maxrow: 9, mincol: 6, maxcol: 9}
  ];


  function getInitialDataAJAX(){
    $.ajax({
      url: 'http://fvi-grad.com:4004/sudoku',
      success: function(res, txt, xhr){
        createTableWithData(res);
      },
      method: 'GET',
      error:  function(error){
        console.log(error);
      }
    });
  }


  function createTableWithData(data){
    var $table = $('<table></table>');
    for(var i = 0; i < data.length; i++){
      var $row = $('<tr></tr>');
      for(var j = 0; j < data[i].length; j++){
        var $cell = $('<td></td>');
        if(data[i][j] !== '') $cell.html(data[i][j]);
        else $cell.html('<input type="text" />');

        if(i % 3 == 0) $cell.addClass('limit-row');
        if(j % 3 == 0) $cell.addClass('limit-column');

        $row.append($cell);
      }
      $table.append($row);
    }
    $('#general-container').append($table);
    $('#general-container').append($('<button type="button">Validate</button>'));
  }


  function checkValidSolution(){
    var $table = $('table');
    var arr = convertTableToArray($table);

    var countRows = 0;
    var countCols = 0;
    var countRanges = 0;

    // Check rows
    for(var i = 0; i < 9; i++){
      var rowRes = checkRow(arr, i);
      countRows += rowRes;

      if(rowRes === 0) {
        var row = $table.children('tr')[i];
        $(row).removeClass().addClass('empty');
      }

      if(rowRes === 1) {
        var row = $table.children('tr')[i];
        $(row).removeClass().addClass('duplicated');
      }

      if(rowRes === 2) {
        var row = $table.children('tr')[i];
        $(row).removeClass().addClass('correct');
      }
    }


    // Check cols
    for(var i = 0; i < 9; i++){
      var colRes = checkColumn(arr, i);
      countCols += colRes;

      if(colRes === 0) {
        paintColumn($table, i, 'empty');
      }

      if(colRes === 1) {
        paintColumn($table, i, 'duplicated');
      }

      if(colRes === 2) {
        paintColumn($table, i, 'correct');
      }
    }


    // check ranges
    for(var i = 0; i < ranges.length; i++){
      var rangeRes = checkRange(arr, ranges[i].minrow, ranges[i].maxrow,
                                     ranges[i].mincol, ranges[i].maxcol);
      countRanges += rangeRes;

      if(rangeRes === 0) {
        paintRange($table, ranges[i].minrow, ranges[i].maxrow,
                           ranges[i].mincol, ranges[i].maxcol, 'empty');
      }

      if(rangeRes === 1) {
        paintRange($table, ranges[i].minrow, ranges[i].maxrow,
                           ranges[i].mincol, ranges[i].maxcol, 'duplicated');
      }

      if(rangeRes === 2) {
        paintRange($table, ranges[i].minrow, ranges[i].maxrow,
                           ranges[i].mincol, ranges[i].maxcol, 'correct');
      }
    }

    if(countRows === 18 && countCols === 18 && countRanges === 18) {
      alert('FELICIDADES!!! Ha Ganado!!!!');
      $table.addClass('win');
    }
  }

  function checkRow(array, row){
    /*  0- empty cell
        1- duplicated cell
        2- correct */

    for(var i = 0; i < 9; i++) {
      if(array[row][i] === '')
        return 0;

      if(countValueInRow(array, row, array[row][i]) > 1)
        return 1;
    }
    return 2;
  }

  function checkColumn(array, col){
    /*  0- empty cell
        1- duplicated cell
        2- correct */

    for(var i = 0; i < 9; i++) {
        if(array[i][col] === '')
          return 0;

        if(countValueInColumn(array, col, array[i][col]) > 1)
          return 1;
      }
      return 2;
  }


  function checkRange(arr, minrow, maxrow, mincol, maxcol){
    /*  0- empty cell
        1- duplicated cell
        2- correct */
    var linear = convertRangeIntoLinear(arr, minrow, maxrow, mincol, maxcol);
    for(var i = 0; i < 9; i++){
      if(linear[i] === '')
        return 0;

      if(countValueInArray(linear, linear[i]) > 1)
        return 1;
    }
    return 2;
  }


  function paintColumn(table, column, paintclass){
    var rows = table.children('tr');
    for(var i = 0; i < 9; i++){
      var $td = $($(rows[i]).children('td')[column]);
      $td.removeClass('empty').removeClass('duplicated').addClass(paintclass);
    }
  }


  function paintRange(table, minrow, maxrow, mincol, maxcol, paintclass){
    var rows = table.children('tr');
    for(var i = minrow; i < maxrow; i++){
      for(var j = mincol; j < maxcol; j++){
        var $td = $($(rows[i]).children('td')[j]);
        $td.removeClass('empty').removeClass('duplicated').addClass(paintclass);
      }
    }
  }


  function convertRangeIntoLinear(arr, minrow, maxrow, mincol, maxcol){
    var linear = [];
    for(var i = minrow; i < maxrow; i++)
      for(var j = mincol; j < maxcol; j++)
        linear.push(arr[i][j]);

    return linear;
  }


  function countValueInColumn(arr, col, value){
    var count = 0;
    for(var i = 0; i < 9; i++) {
      if(arr[i][col] === value)
        count++;
    }
    return count;
  }


  function countValueInRow(arr, row, value){
    var count = 0;
    for(var i = 0; i < 9; i++) {
      if(arr[row][i] === value)
        count++;
    }
    return count;
  }


  function countValueInArray(arr, value){
    var count = 0;
    for(var i = 0; i < 9; i++) {
      if(arr[i] === value)
        count++;
    }
    return count;
  }

  function convertTableToArray(table){
    var array = [];
    var rows = table.children('tr');
    for(var i = 0; i < rows.length; i++){
      var arrayrow = [];
      var cells = $(rows[i]).children('td');
      for(var j = 0; j < cells.length; j++){
        if($(cells[j]).has('input').length){
          var input = $(cells[j]).children('input');
          arrayrow.push($(input).val());
        }
        else {
          var cellvalue = $(cells[j]).html();
          arrayrow.push(cellvalue);
        }
      }
      array.push(arrayrow);
    }
    return array;
  }

  $('#general-container').on('click', 'button', checkValidSolution);

  getInitialDataAJAX();

})();
