// define: 
// upload_dataset() to upload dataset
// variable:
// project_hash_code, project_name, dataset_hash_code, data_type

// create procedure:
// 1. create_upload_html_in_element(element_id)
// 2. 
var model_type_idx_to_file_extension = {1: '.txt', 2: '.xml', 3: '.json'};
// create tables:
var [image_table_id, label_table_id] = ['image_table', 'label_table'];
var table_columns_name = ['Index', 'Name', 'Size', 'Status'];
var [image_table, label_table] = ['', ''];
// init filenames of tables:
var upload_dataset_files = {};
// batch_size for sending file:
const upload_dataset_batch_size = 3;
// unit is byte, default is 1MB:
const upload_dataset_chunkSize = 1024*1024;
// Match files basename between image/label file:
var match_files_basename = [];
// all request which will be sent to server:
var upload_dataset_reqs = [];
var data_type_to_update = "";
var file_extension = '';

function create_upload_html_in_element(element_id) {
    let upload_html = `
    <div>
        <button type="button" class="btn btn-secondary" id="clear_button" onclick="clear_upload_dataset() " style="float: right;"><i class="fas fa-trash-alt"></i> &nbsp Clearing All</button>
    </div>
    <div class="row mb-3" style="margin-top: 3%;" >
        <div class="col-md-6 themed-grid-col">
            <h4>Image</h4>
            <div class="custom-file">
                <input type="file" class="custom-file-input" id="upload_image" name="upload_image" accept="image/*" onchange="add_files_to_upload_dataset_table(this)" multiple>
                <label class="custom-file-label" for="customFile">Choose File</label>
            </div>
            <br><br>
            <div id="image_table_place">
            </div>
        </div>
        <div class="col-md-6 themed-grid-col">
            <h4>Label</h4>
            <div class="custom-file">
                <input type="file" class="custom-file-input" id="upload_dataset_label" name="upload_dataset_label" accept=".json,.txt,.xml" onchange="add_files_to_upload_dataset_table(this)" multiple>
                <label class="custom-file-label" for="customFile">Choose File</label>
            </div>
            <br><br>
            <div id="label_table_place">
            </div>
        </div>
    </div>
    <hr><br>

    <!-- Button trigger modal -->
    <input type="hidden" id="custId" name="custId" data-toggle="modal" data-target="#staticBackdrop">
    <button type="button" class="btn btn-primary float-right" id="upload_dataset_button" onclick="upload_dataset(this)">Upload</button>

    <!-- modal part -->
    <!-- Button trigger modal -->
    <input type="hidden" id="upload_dataset_progress_button" name="upload_dataset_progress_button" data-toggle="modal" data-target="#upload_dataset_modal">
    <!-- modal content -->
    <div class="modal fade" id="upload_dataset_modal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Dataset Uploading...</h5>
            </div>
            <div class="modal-body">
                <div class="progress">
                    <input type="hidden" id="progressbar_number" value="1">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" id="upload_dataset_progressbar" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 1%">
                        0%
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" id="cancel_button" class="btn btn-primary" onclick="cancel_upload(true)">Cancel</button>
            <!-- <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> -->
            </div>
        </div>
        </div>
    </div>
    `;
    document.getElementById(element_id).innerHTML += upload_html;
    [image_table, label_table] = create_image_label_tables();
}

function create_table(table_id, columns_name, use_checkbox = false) {
    var table = document.createElement('table');
    table.setAttribute("class", "table table-striped table-bordered text-center");
    // table.setAttribute("class", "table table-striped table-bordered");
    // table.setAttribute("class", "table");
    table.setAttribute("id", table_id);

    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    if (use_checkbox) {
        var th = document.createElement('th');
        th.innerHTML = '<input type="checkbox" onclick="checkAll(this)">'
        tr.appendChild(th);
    }

    for (var column_idx = 0; column_idx < columns_name.length; column_idx++) {
        let column_name = columns_name[column_idx];
        var th = document.createElement('th');
        th.setAttribute("scope", "col");
        th.textContent = column_name;
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    table.append(thead);

    return table
}

function create_image_label_tables() {
    let image_table_place = document.getElementById('image_table_place');
    let image_table = create_table(image_table_id, table_columns_name);
    image_table_place.appendChild(image_table);
    let label_table_place = document.getElementById('label_table_place');
    let label_table = create_table(label_table_id, table_columns_name);
    label_table_place.appendChild(label_table);
    image_table = $(`#${image_table_id}`).DataTable({
            "lengthMenu": [[5, 10, 20, -1], [5, 10, 20, "All"]],
            "order": [[ 1, 'asc' ]], 
            "info":false,
            "autoWidth": false,
            "columnDefs": [ {
                "searchable": false,
                "orderable": false,
                "width":"10%",
                "targets": 0
            } ]
        });
    label_table = $(`#${label_table_id}`).DataTable({
            "lengthMenu": [[5, 10, 20, -1], [5, 10, 20, "All"]],
            "order": [[ 1, 'asc' ]], 
            "info":false,
            "autoWidth": false,
            "columnDefs": [ {
                "searchable": false,
                "orderable": false,
                "width":"10%",
                "targets": 0
            } ]
        });

    return [image_table, label_table]
}

function cancel_upload(use_confirm=false){
    var status = true;
    if (use_confirm) {
        status = confirm("Continue Leave?");
    }
    if(status){
        // cancel all requests:
        upload_dataset_reqs.map(r => r.cancel());
        
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            // init 
            match_files_basename = [];
            // hide modal:
            $('#upload_dataset_modal').modal('hide');
            set_progress(0);
        }
        let uploading_images_form_data = get_uploading_images_form_data(true);
        xhttp.open("POST",'/delete_image', true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.setRequestHeader("X-CSRF-TOKEN", csrf_refresh_token);
        xhttp.send(uploading_images_form_data);
    }
    // if (socket.disconnected) {
    //     reconnect_websocket();
    // }
}

function update_dataset_datatype(data_type) {
    return new Promise((resolve) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            resolve(xhttp.responseText);
        }
        xhttp.open("POST",'/update_dataset_datatype', true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.setRequestHeader("X-CSRF-TOKEN", csrf_refresh_token);
        xhttp.send(`project_hash_code={${project_hash_code}&dataset_hash_code=${dataset_hash_code}&data_type=${data_type}`);
    })
}

function add_files_to_upload_dataset_table(element) {
    let [show_table, file_type] = [image_table, 'image'];
    let consistency = true;
    if (element.id === 'upload_dataset_label') {
        [show_table, file_type] = [label_table, 'label'];
        consistency = check_label_extension_consistency();
    }
    if (!consistency) {
        // alert('Inconsistent file extensions.');
        clean_label_input_file_list()
        return 
    }
    let add_files = element.files;
    let add_files_detail = new Array();
    let start = performance.now();
    for (let add_file_idx = 0; add_file_idx < add_files.length; add_file_idx++) {
        let add_file_detail = new Array(table_columns_name.length);
        let add_file = add_files[add_file_idx];
        let add_file_basename = baseName(add_file.name);
        try {
            if (Object.keys(upload_dataset_files[add_file_basename]).includes(file_type)) {
                continue
            }
        }
        catch (err) {
            if (err instanceof TypeError) {
                upload_dataset_files[add_file_basename] = {};
            }
        }

        upload_dataset_files[add_file_basename][file_type] = add_file;

        add_file_detail[table_columns_name.indexOf('Index')] = '';
        add_file_detail[table_columns_name.indexOf('Name')] = add_file.name;
        add_file_detail[table_columns_name.indexOf('Size')] = size_transfer(add_file.size);
        add_file_detail[table_columns_name.indexOf('Status')] = '-';
        
        add_files_detail.push(add_file_detail);
    }
    // insert all of data into table:
    if (add_files_detail.length) {
        show_table.rows.add( 
            add_files_detail
        ).draw( false );
    }
    let end = performance.now();
    console.log(`Execution time: ${end - start} ms`);
    check_files_match();
}

function clear_upload_dataset() {
    let toclear_dataset = confirm(`Are you sure to delete dataset ?`);
    if (toclear_dataset) {
        image_table.clear().draw();
        label_table.clear().draw();
        init_files();
        clean_label_input_file_list();
    }
}

function check_files_match() {
        
    match_basename(image_table, label_table);
    match_basename(label_table, image_table);

    change_status_color(image_table);
    change_status_color(label_table);

    // rule 1. :
    function match_basename(table_1, table_2) {
        let [tab_1_filenames, tab_1_status] = get_images_basename_and_status_in_original_order(table_1);
        let [tab_2_filenames, tab_2_status] = get_images_basename_and_status_in_original_order(table_2);

        for (let tab_1_filename_idx = 0; tab_1_filename_idx < tab_1_filenames.length; tab_1_filename_idx++) {
            let tab_1_filename= tab_1_filenames[tab_1_filename_idx];
            let status = 'Mismatch';
            if (tab_2_filenames.includes(tab_1_filename)) {
                status = 'Match';
                table_2.cell(
                    tab_2_filenames.indexOf(tab_1_filename), 
                    table_columns_name.indexOf('Status')
                ).data(status);
            }
            // change file status:
            table_1.cell(
                tab_1_filename_idx, 
                table_columns_name.indexOf('Status')
            ).data(status);
        }
    }

    function change_status_color(table) {
        let table_status = table.column(table_columns_name.indexOf('Status')).nodes();
        for (let tab_1_filename_idx = 0; tab_1_filename_idx < table_status.length; tab_1_filename_idx++) {
            if (table_status[tab_1_filename_idx].textContent === 'Match') {
                // image_table_status[tab_1_filename_idx].setAttribute('style', 'color: green');
                $(table_status[tab_1_filename_idx]).css('color', 'green');
            }
            else {
                $(table_status[tab_1_filename_idx]).css('color', 'red');
            }
        }
    } 

    function get_images_basename_and_status_in_original_order(table) {
        let num_files = table.data().length;
        let [images_basename, status] = [[], []];
        for (let file_idx = 0; file_idx < num_files; file_idx ++) {
            images_basename.push(baseName(table.cell(file_idx, table_columns_name.indexOf('Name')).data()));
            status.push(table.cell(file_idx, table_columns_name.indexOf('Status')));
        }
        return [images_basename, status]
    }
}

function set_progress(percentage) {
    percentage = `${percentage}%`;
    let progress = document.getElementById('upload_dataset_progressbar');
    progress.style.width = percentage;
    progress.textContent = percentage;
}

function check_label_extension_consistency(){
    let consistency = true;
    // check file extension in input element:
    let files_extension_from_input = Array.from(document.getElementById('upload_dataset_label').files).map(file => getFileExtension(file.name));
    let files_extension_from_input_set = new Set(files_extension_from_input);
    // if extension is not unique:
    if (files_extension_from_input_set.size > 1) {
        alert('Select files have multiple extension.')
        consistency = false;
        return consistency
    }
    // Second, check file extension is consistent with data_type which is decided by db.:
    let data_type_arr = file_extension.split(',').filter(dt => dt).map(dt => dt.replace('.', ''));
    if (!data_type_arr.includes(Array.from(files_extension_from_input_set)[0])) {
        alert(`Please select correct file extension: ${file_extension}`)
        consistency = false;
        return consistency
    }
    // check with file extension in label table:
    let files_extension_from_table = label_table.columns(table_columns_name.indexOf('Name')).data().toArray()[0].map(filename => getFileExtension(filename));
    let files_extension_from_both = new Set(files_extension_from_table.concat(files_extension_from_input));
    if (files_extension_from_both.size > 1) {
        alert('Select files extension are not consistent with existing files.')
        consistency = false;
        return consistency
    }
    if (consistency) {
        data_type_to_update = Array.from(files_extension_from_both)[0];
    }
    return consistency
}


// upload function:
async function upload_dataset_API(target_url='/upload_dataset') {
    return new Promise(async (resolve) => {
        // get number of match files:
        let total_num_files = image_table.column(table_columns_name.indexOf('Status')).data().toArray().filter(status => status === 'Match').length;
        if (!total_num_files) {
            alert('Please select files to upload.')
            return 
        }
        // 
        avoid_unexpectated_unload(turn_on=true);
        // update model type first:
        let response = await update_dataset_datatype(data_type_to_update);
        // display progress windows:
        document.getElementById('upload_dataset_progress_button').click();
        
        let total_progress_steps = Math.ceil(total_num_files / upload_dataset_batch_size);
        let current_prgress_steps = 0;
        let progress = document.getElementById('upload_dataset_progressbar');
        // check status in image table, if two tables are matched, upload it:
        let data = image_table.rows().data().toArray();
        var [responses, file_idx] = [[], 0];
        let start = performance.now();
        for (let data_idx = 0; data_idx < data.length; data_idx++) {
            let datum = data[data_idx];
            // skip mismatch image/label files:
            if (datum[table_columns_name.indexOf('Status')] === 'Mismatch') {
                continue
            }
            let match_file_basename = baseName(datum[table_columns_name.indexOf('Name')]);
            let image_file = upload_dataset_files[match_file_basename]['image'];
            let label_file = upload_dataset_files[match_file_basename]['label'];

            responses = responses.concat([upload_file_API(image_file, target_url), upload_file_API(label_file, target_url)]);

            file_idx ++;
            match_files_basename.push(match_file_basename);

            if (file_idx % upload_dataset_batch_size === 0 || file_idx === total_num_files) {
                responses = await Promise.all(responses);
                responses = [];

                current_prgress_steps++;
                let current_progress_percentage = Math.ceil(current_prgress_steps / total_progress_steps * 100);
                set_progress(current_progress_percentage);
            }
        }
        let end = performance.now();
        console.log(`Execution time: ${end - start} ms`);
        setTimeout(async function() {
            avoid_unexpectated_unload(turn_on=false)
            alert('Upload dataset completely');
            $('#upload_dataset_modal').modal('hide')
            let _ = await update_split_dataset_json_API()
            resolve('finish');
        }, 1000);
    })
}

function upload_file_API(file, target_url='/upload_dataset') {
    return new Promise(resolve => {
        let r = new Resumable({
            target: target_url,
            chunkSize: upload_dataset_chunkSize,
            simultaneousUploads: 1,
            query: {
                'project_hash_code': project_hash_code,
                'dataset_hash_code': dataset_hash_code 
            },
            headers: {
                'X-CSRF-TOKEN': csrf_refresh_token
            }
        });

        r.addFile(file);

        r.on('fileSuccess', function(file, message){
            resolve(message);
        });

        r.upload();

        upload_dataset_reqs.push(r);
    })
}

function update_split_dataset_json_API() {
    return new Promise((resolve) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            resolve(1);
        }

        xhttp.open("POST",`/${project_hash_code}/${dataset_hash_code}/update_all_dataset_set_json`, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.setRequestHeader("X-CSRF-TOKEN", csrf_refresh_token);
        xhttp.send();
    })
}

function clean_label_input_file_list() {
    document.getElementById('upload_dataset_label').value = null;
document.getElementById('upload_image').value = null;
}

// error handle function:
function avoid_unexpectated_unload(turn_on=true) {
    if (turn_on) {
        window.addEventListener('beforeunload', send_beacon_when_unload);
    }
    else {
        window.removeEventListener('beforeunload', send_beacon_when_unload);
    }
}

function send_beacon_when_unload(event) {
    // display dialog:
    event.returnValue = true;

    window.onunload = () => {
        let uploading_images_form_data = get_uploading_images_form_data(queryString_format=false);
        navigator.sendBeacon('/delete_image', uploading_images_form_data);
    }
}

// basic function:
function baseName(str) {
    var base = new String(str).substring(str.lastIndexOf('/') + 1); 
    if(base.lastIndexOf(".") != -1) {
        base = base.substring(0, base.lastIndexOf("."));
    }
    return base;
}

function getFileExtension(filename){
    // get file extension
    const extension = filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
    return extension;
}

function init_files() {
    upload_dataset_files = {};
}

function reverse_json(json){
    var ret = {};
    for(var key in json){
        ret[json[key]] = key;
    }
    return ret;
}

function limit_label_extension() {
    file_extension = data_type != -1? model_type_idx_to_file_extension[data_type]: Object.values(model_type_idx_to_file_extension).join(',');
    let upload_label_input = document.getElementById('upload_dataset_label');
    upload_label_input.setAttribute('accept', file_extension);
}

function get_uploading_images_form_data(queryString_format=true) {

    // console.log(uploading_images_form_data)
    if (queryString_format) {
        var uploading_images_form_data = `project_hash_code=${project_hash_code}&dataset_hash_code=${dataset_hash_code}&data_list=${match_files_basename.toString()}`;
    }
    else {
        var uploading_images_form_data = new FormData();
        uploading_images_form_data.append('project_hash_code', project_hash_code);
        uploading_images_form_data.append('dataset_hash_code', dataset_hash_code);
        uploading_images_form_data.append('data_list', match_files_basename.toString());
        uploading_images_form_data.append('csrf_token', csrf_refresh_token);
    }
    return uploading_images_form_data
}

function size_transfer(byte) {
    let size = '';
    let unit_gap = 1024;
    let unit = '';
    let divide_value = new Number(1);
    if (byte >= unit_gap && byte < unit_gap ** 2) {
        divide_value = unit_gap;
        unit = `KiB`;
    }
    else if (byte >= unit_gap ** 2 && byte < unit_gap ** 3) {
        divide_value = unit_gap ** 2;
        unit = `MiB`
    }
    else if (byte >= unit_gap ** 3 && byte < unit_gap ** 4) {
        divide_value = unit_gap ** 3;
        unit = `GiB`
    }
    else {
        unit = `Byte`;
    }
    size = `${(byte / divide_value).toFixed(1)} ${unit}`;
    
    return size
}

function getCookieByName(name) {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${name}=`))
        .split('=')[1];
    return cookieValue
}

const csrf_refresh_token = getCookieByName('csrf_refresh_token')

$(document).ready(function() {
    auto_generate_index(image_table);
    auto_generate_index(label_table);
    limit_label_extension();

    function auto_generate_index(table) {
        table.on('order.dt search.dt', function () {
            table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
                cell.innerHTML = i+1;
            });
        }).draw();
    }
})