
        function TestTable1() {
            $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                var taskState={
                {% if attribute(app,'taskState') is defined %}
                    {% for key, item in app.taskState %}
                        {% if not loop.last %}'{{ key }}':'{{item.title}}',{% else %}'{{ key }}':'{{item.title}}'{% endif %}
                    {% endfor %}
                {% endif%}
                };
                var taskStateColor=[
                {% if attribute(app,'taskStateColor') is defined %}
                    {% for item in app.taskStateColor %}
                        {% if not loop.last %}'{{item}}',{% else %}'{{item}}'{% endif %}
                    {% endfor %}
                {% endif%}
                ];
                if (typeof (json.data) == 'object') {
                    for (var i in json.data) {
                        var id = json.data[i].id;
                        var state = json.data[i].state;
                        var name = json.data[i].name;
                        var messages = json.data[i].messages;
                        json.data[i].messages = messages!="0"?'<a href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/task-detail-{% if app['task_type'] == 'karaoke' %}karaoke{% else %}video{% endif %}?id='+ id + '">{{ 'new'|trans }}</a>':'<span>-</span>';
                        json.data[i].name = '<a href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/task-detail-{% if app['task_type'] == 'karaoke' %}karaoke{% else %}video{% endif %}?id='+ id + '">' + name + '</a>';
                        
                        json.data[i].state = '<span class="txt-' + taskStateColor[state] + '">'+taskState[state]+'</span>';
                        
                        var dateOn = new Date(json.data[i]['start_time'] * 1000);
                        json.data[i].start_time = dateOn.toLocaleFormat("%b %d, %Y %H:%M");
                        
                        json.data[i].operations = "<div class='col-xs-3 col-sm-8'>";
                        if (state == '0' || state == '3') {
                            json.data[i].operations +="<a href='#' class='dropdown-toggle no_context_menu' data-toggle='dropdown'>\n\
                                                            <i class='pull-right fa fa-cog'></i>\n\
                                                        </a>\n\
                                                        <ul class='dropdown-menu pull-right'>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/task-state-change' data-taskid='" + id + "' data-apply='ended'>\n\
                                                                    <span>{{ 'Done'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/task-state-change' data-taskid='" + id + "' data-apply='rejected'>\n\
                                                                    <span>{{ 'Reject'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                        </ul>";
                                            }
                        json.data[i].operations +="</div>";
                    }
                }
            }).dataTable({
                "processing": true,   
                "serverSide": true,
                "ajax": {
                    "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/tasks-list-json",
                    "data": function (d) {
                        d = dataTableDataPrepare(d);
                        d['task_type'] = '{{ app['task_type'] }}';
                    }
                },
                "language": {
                    "url": "{{ app.datatable_lang_file }}"
                },
                {% if attribute(app, 'dropdownAttribute') is defined %}
                    {{ main_macro.get_datatable_column(app['dropdownAttribute']) }}
                {% endif %}
                "bFilter": true,
                "bPaginate": true,
                "bInfo": true,
                "order": [[ 4, "desc" ]],
                "columnDefs": [
                    { className: "action-menu", "targets": [ -1 ] },
                    {"searchable": false, "targets": [-1, -2, -3, -4, 1]},
                    {"sortable": false, "targets": [-1, 1]}
                ]
            });
        }

        function yelp() {
            $(document).ready(function () {
                $(document).on('click', "a.main_ajax[disabled!='disabled']", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var sendData = $(this).data();
                    sendData['task_type'] = '{{ app['task_type'] }}';
                    ajaxPostSend($(this).attr('href'), sendData, false, false);
                    $(this).closest('div.open').removeClass('open');
                    return false;
                });

                LoadDataTablesScripts(TestTable1);
            });
        }

        document.addEventListener("DOMContentLoaded", yelp, false);

        var manageTasks = function (obj) {
            JSSuccessModalBox(obj);
            $('#datatable-1').DataTable().ajax.reload();
        };

        var manageTasksError = function (obj) {
            JSErrorModalBox(obj);
        };
