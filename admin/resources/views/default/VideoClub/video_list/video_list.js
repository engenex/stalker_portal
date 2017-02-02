
    function TestTable1() {
        $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                if (typeof (json.data) == 'object' && json.data.length >0) {
                    for (var i in json.data) {
                        var id = json.data[i].id;
                        var status = json.data[i].status;
                        var accessed = json.data[i].accessed;
                        var path = json.data[i].path;
                        var tasks = json.data[i].tasks;

						json.data[i].operations = "<div class='col-xs-3 col-sm-8'>\n\
                                                        <a href='#' class='dropdown-toggle' data-toggle='dropdown'>\n\
                                                            <i class='pull-right fa fa-cog'></i>\n\
                                                        </a>\n\
                                                        <ul class='dropdown-menu pull-right'>\n\
                                                            <li>\n\
                                                                <a href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/edit-video?id="+id+"'>\n\
                                                                    <span>{{ 'Edit'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/" + (accessed!=0 ?"disable":"enable")+"-video' data-videoid='"+id+"'>\n\
                                                                    <span>" + ( accessed ? "{{ 'Unpublish'|trans }}": "{{ 'Publish'|trans }}") + "</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/create-tasks' data-videoid='"+id+"'>\n\
                                                                    <span>{{ 'Create task'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/video-logs?video_id="+id+"'>\n\
                                                                    <span>{{ 'Activity log'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/remove-video' data-videoid='"+id+"'>\n\
                                                                    <span>{{ 'Remove'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                        </ul>\n\
                                                    </div>";
                        if (json.data[i]['task_date_on'] != 0) {
                            var dateOn = new Date(json.data[i]['task_date_on']);
                        }
                        json.data[i].accessed = (accessed != 0 ? "<span class=''>{{ 'Published'|trans }}</span>" : ((typeof(json.data[i].task_id) != 'undefined' && json.data[i].task_id)?"<span class=''>{{ 'Scheduled'|trans }} "+ (json.data[i]['task_date_on'] != 0 ? "({{ 'on'|trans }} " + dateOn.toLocaleFormat("%b %d, %Y")+ ")": "") +"</span>": "{{ 'Unpublished'|trans }}"));

                        if (json.data[i]['added'] != 0) {
                            var dateOn = new Date(json.data[i]['added']);
                            json.data[i]['added'] = dateOn.toLocaleFormat("%b %d, %Y");
                        }

                        json.data[i].name = ("<a href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/edit-video?id=" + id + "' data-fieldname='name'>" + json.data[i].name + "</a>");

                        json.data[i].path = '<a href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/video-info" class="main_ajax" data-videoid="'+id+'">' + path + '</a>';
                        
                        var taskStr = '';
                        var msgClass = '';
                        if (typeof(tasks) == 'object' && tasks.length > 0) {
                            var itemCounter = tasks.length - 1;
                            for (var num in tasks) {
                                var endDate = new Date(tasks[num]['end_time']);
                                
                                if (tasks[num]['ended'] || tasks[num]['rejected'] ) {
                                    msgClass += " line-through ";
                                    if (tasks[num]['rejected'] ) {
                                        msgClass += " txt-warning ";
                                    } else if (tasks[num]['ended']){
                                        msgClass += "";
                                    }
                                } else if (tasks[num]['expired']){
                                    msgClass += " txt-danger ";
                                }
                                
                                taskStr += '<a class="' + msgClass + '" href="{{ app.request_context.baseUrl }}/tasks/task-detail-video?id=' + tasks[num]['id']+ '">№' + tasks[num]['id'] + (!(tasks[num]['ended'] || tasks[num]['rejected']) && tasks[num]['end_time'] ? ' ({{ 'ending'|trans }} ' + endDate.toLocaleFormat("%d-%m-%Y") + ')': '') + '</a>' + (num != itemCounter?', ': '');
                                msgClass = '';
                            }
                        } else {
                            taskStr = "{{ 'No tasks'|trans }}";
                        }
                        json.data[i].tasks = taskStr;
                        
                        json.data[i].complaints = '';
                        if (json.data[i].video_counter) {
                            json.data[i].complaints += (" {{ 'video'|trans }} - " + json.data[i].video_counter);
                        }
                        
                        if (json.data[i].sound_counter) {
                            json.data[i].complaints += (" {{ 'sound'|trans }} - " + json.data[i].sound_counter);
                        }
                        if (!json.data[i].complaints) {
                            json.data[i].complaints = "0"
                        }
                        if (!json.data[i].on_storages){
                            json.data[i].accessed += "<br><span class=''>{{ 'Not available on storages'|trans }}</span>";
                        }
                    }
                }
            }).dataTable({
            "processing": true,
            "serverSide": true,
            "ajax": {
                "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/video-list-json"
            },
            "language": {
                "url": "{{ app.datatable_lang_file }}"
            },
			"order": [[ 1, "asc" ]],

            {% if attribute(app, 'dropdownAttribute') is defined %}
            {{ main_macro.get_datatable_column(app['dropdownAttribute']) }}
            {% endif %}
			
            "scrollCollapse": true,
            "bFilter": true,
            "bPaginate": true,
            "bInfo":     true,
			"order": [[ 0, "desc" ]],
			"bSort" : true,
	
            "aoColumnDefs": [ 
                { className: "action-menu", "targets": [ -1 ] },
                { "targets": [ -1 , 5, 6], "orderable": false},
                { "searchable": false, "targets": [ 6, 8, 9, 12, 13, 14 ] }
            ]
            
        }).prev('.dataTables_processing').hide('');
    }

    function DemoSelect2() {
        $('#s2_video_moderators').select2({minimumResultsForSearch: -1, dropdownAutoWidth: false, width: '100%'});
    }

    function yelp() {
        $(document).ready(function () {
            LoadDataTablesScripts(TestTable1);
            LoadSelect2Script(DemoSelect2);
           $(document).on('click', "a.main_ajax", function (e) {
                e.stopPropagation();
                e.preventDefault();
                var _this = $(this);

                if (_this.attr('href').search("enable") != -1 && !_this.data('video_on_date')) {
                    setEnableDatePicker(_this);
                    return false;
                }

                if (_this.attr('href').search("create-tasks") != -1 && !_this.data('sendData')) {
                    showTaskForm(_this);
                    return false;
                }

                if (!_this.data('atcion')) {
                    $.ajax({
                        url: $(this).attr('href'),
                        type: 'POST',
                        data: $(this).data(),
                        success: function (data) {
                            if (data.success) {
                                if (typeof(data.nothing_to_do) == 'undefined' || !data.nothing_to_do) {
                                    notty('<span>{{ 'Finish'|trans }}!</span>', 'success');
                                }
                                $('#modalbox_ad').hide();
								$('#modalbox_ad').find('input[type="hidden"]').val('').next().text('');
								$('#modalbox_ad').find('textarea').val('');
                                for (var key in data) {
                                    _this.data(key, data[key]);
                                }
                            } else {
                                notty('{{ 'Some server error'|trans }}','notification');
                            }
                        },
                        error: function (data) {
                            var errAction = '';
                            if (typeof(data.responseJSON) == 'object') {
                                errAction +=  data.responseJSON.action + 'Error';
                                for (var key in data.responseJSON) {
                                    _this.data(key, data.responseJSON[key]);
                                }
                            }
                            if ($.isFunction(window[errAction])) {
                                window[errAction]($(_this));
                            } else {
                                notty('{{ 'Some network error or access denied'|trans }}','notification');
                            }
                        },
                        dataType: "json",
                        async: false
                    });
                } 

                if ($.isFunction(window[$(this).data('action')]) && !$(this).data('error')) {
                    window[$(this).data('action')]($(this));
                }
                _this.closest('div.open').removeClass('open');
                $("#datatable-1").DataTable().ajax.reload();
                return false;
            });

            $(document).on('click', "#apply_enable_date", function(e){
                e.stopPropagation();
                e.preventDefault();
                $("a[data-videoid='" + $("#modalbox input[type='hidden']").val() + "'][href*='enable']")
                        .data('video_on_date', $("#modalbox input[type='text']").val())
                        .click();
                $("div[id*='datepicker']").hide().remove();
                closeModalBox();
                $("div[id*='datepicker']").remove();
                return false;
            });
            
            $(document).on('click', "#reset_enable_date, #modalbox, #modalbox a.close-link, #modalbox a.close-link *", function(e){
                if (e.currentTarget != e.target) {
                    return;
                }
                e.stopPropagation();
                e.preventDefault();
                $("div[id*='datepicker']").hide().remove();
                closeModalBox();
                return false;
            });
            
            $(document).on('click', "#modalbox_ad button[type='submit']", function (e) {
                var sendData = {
                    id: $("#modalbox_ad input[type='hidden']").val(),
                    to_usr: $("#modalbox_ad select").val(),
                    comment: $("#modalbox_ad textarea").val()
                };
                
                e.stopPropagation();
                e.preventDefault();
                var linkObj = $("a[data-videoid='" + $("#modalbox_ad input[type='hidden']").val() + "'][href*='create']");
                
                linkObj.data('sendData', sendData).click();
                return false;
            });
        });
    }

    document.addEventListener("DOMContentLoaded", yelp, false);

    var setMD5Error = function(obj){
        if ($(obj).data("error")) {
            $(obj).replaceWith('<span class="txt-danger"> &nbsp;' + $(obj).data("error") + '&nbsp; </span>');
        }

    };

    var videoinfo = function (obj){
        $('#modalbox').show();
        $('#modalbox').find('.modal-header-name span').text($(obj).data('title'));
        var baseInfo = $(obj).data('base_info');
        if (typeof(baseInfo) == 'string') {
            $('#modalbox').find('.devoops-modal-inner').append('<span>' + baseInfo + '</span>');
        } else if (typeof(baseInfo) == 'object') {
            var table = $('<table class="video_info"></table>').appendTo($('#modalbox').find('.devoops-modal-inner'));
            table.append('<tr><td>{{ 'Server'|trans }}</td><td>{{ 'Catalogue'|trans }}</td><td>{{ 'Episodes'|trans }}</td><td>&nbsp;</td></tr>');
            $.each(baseInfo, function(index, value){
                var trStr = '<tr><td>'+ value.storage_name +'</td><td>'+ value.path +'</td><td>'+ value.series +'</td>';
                    trStr += '<td><a class="main_ajax" href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/get-md5">{{ 'Calculate MD5 checksum'|trans }}</a></td></tr>';
                table.append(trStr);
                table.find('a').data('storage_name', value.storage_name);
                table.find('a').data('media_name', value.path);
                if (value.files.length > 0 ) {
                    var filesStr = '';
                    $.each(value.files, function(f_index, f_value){
                        filesStr += '<span class="video_file_name">' + f_value.name + '</span>';
                    });
                    table.append('<tr><td colspan="4">' + filesStr + '</td></tr>');
                }
            });
        }
    };

    function closeModalBox(){
        $("#modalbox").hide();
        $('#modalbox').find('.modal-header-name span').empty();
        $('#modalbox').find('.devoops-modal-inner').empty();
        $('#modalbox').find('.devoops-modal-bottom').empty();
    }

    function setEnableDatePicker(obj){
        $('#modalbox').find('.modal-header-name span').text('{{ 'Schedule of publishing'|trans }}');
		
		 $('#modalbox').find('.devoops-modal-inner').html('\n\
                <div class="box-content">\n\
                    <form class="form-horizontal" role="form">\n\
                        <div class="form-group">\n\
                            <label class="col-sm-3 control-label col-sm-offset-1">{{ 'Schedule of publishing'|trans }}</label>\n\
                            <div class="col-xs-10 col-sm-8">\n\
                                <span class="col-xs-8 col-sm-8">\n\
                                   <input type="hidden" name="link_id" value="' + obj.data('videoid') + '">\n\
                                   <input type="text" class="form-control own_fields datepicker col-sm-12" data-date-format="dd-mm-yy" name="video_on_date">\n\
                                    <div class="bg-danger"></div>\n\
                                </span>\n\
                            </div>\n\
                        </div>\n\
                    </form>\n\
                </div>');
				

		$('#modalbox').find('.devoops-modal-bottom').html('<div class="pull-right no-padding">&nbsp;</div>\n\
                        <div class="pull-right no-padding">\n\
                            <button type="submit" id="apply_enable_date" class="btn btn-success  pull-right">{{ 'Publish'|trans }}</button>\n\
                            <button type="reset" id="reset_enable_date" class="btn btn-default pull-right" >{{ 'Cancel'|trans }}</button>\n\
                        </div>');
   
        $(".datepicker").datepicker({
                language    : 'ru',
                dateFormat  : 'dd-mm-yy',
                firstDay    : 1,
                minDate     : new Date(),
                dayNamesMin : [
                    '{{ 'Sun'|trans }}',
                    '{{ 'Mon'|trans }}',
                    '{{ 'Tue'|trans }}',
                    '{{ 'Wed'|trans }}',
                    '{{ 'Thu'|trans }}',
                    '{{ 'Fri'|trans }}',
                    '{{ 'Sat'|trans }}'
                ],
                monthNames  : [
                    '{{ 'January'|trans }}',
                    '{{ 'February'|trans }}',
                    '{{ 'March'|trans }}',
                    '{{ 'April'|trans }}',
                    '{{ 'May'|trans }}',
                    '{{ 'June'|trans }}',
                    '{{ 'July'|trans }}',
                    '{{ 'August'|trans }}',
                    '{{ 'September'|trans }}',
                    '{{ 'October'|trans }}',
                    '{{ 'November'|trans }}',
                    '{{ 'December'|trans }}'
                ]
            }
            );
        $("div[id*='datepicker']").addClass('dp_white');
        $(obj).closest('div.open').removeClass('open');
        $('#modalbox').show();
    }

    function showTaskForm(obj){
        var showName = $(obj).closest('tr').find('a[data-fieldname="name"]').text();
        $('#modalbox_ad').find('input[type="hidden"]').val($(obj).data('videoid')).next().text(showName);
        $('#modalbox_ad').show();
        $('#modalbox_ad textarea').focus();
        $(obj).closest('div.open').removeClass('open');
    }
    
    function hideTaskForm(obj){
        
        $('#modalbox_ad').find('input[type="hidden"]').val('').next().text('');
        $('#modalbox_ad').find('textarea').val('');
        $('#modalbox_ad').hide();
        $(obj).closest('div.open').removeClass('open');
    }
