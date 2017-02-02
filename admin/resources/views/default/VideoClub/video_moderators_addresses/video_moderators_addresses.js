
    function TestTable1() {
        $('#datatable-1').on('xhr.dt', function (e, settings, json) {
            if (typeof (json.data) == 'object') {
                var id, name, status;
                for (var i in json.data) {
                    id = json.data[i].id;
                    name = json.data[i].name;
                    status = json.data[i].status;

                    json.data[i]['name'] = '<a href="{{ app.controller_alias }}/edit-video-moderators?id='+id+'">'+name+'</a>';
                    json.data[i]['disable_vclub_ad'] = ( json.data[i]['disable_vclub_ad'] ? "<span class=''>{{ 'Yes'|trans }}</span>" : "<span class=''>{{ 'No'|trans }}</span>");
                    json.data[i]['status'] = ( status ? "<span class=''>{{ 'Switched on'|trans }}</span>" : "<span class=''>{{ 'Switched off'|trans }}</span>");

                    json.data[i].operations = '<div class="col-xs-3 col-sm-8 ddd">\n\
                                                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">\n\
                                                            <i class="pull-right fa fa-cog"></i>\n\
                                                        </a>\n\
                                                        <ul class="dropdown-menu pull-right">\n\
                                                            <li>\n\
                                                                <a href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/edit-video-moderators?id='+id+'">\n\
                                                                    <span>{{ 'Edit'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class="main_ajax" href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/toggle-video-moderators-status" data-modstatus="'+(status ? 0: 1)+'" data-modid="'+id+'">\n\
                                                                    <span>'+ (status ? "{{ 'Switch off'|trans }}":"{{ 'Switch on'|trans }}") +'</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class="main_ajax" href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/remove-video-moderators" data-modid="'+id+'">\n\
                                                                    <span>{{ 'Delete'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                        </ul>\n\
                                                    </div>';

                }
            }
        }).dataTable({
            "processing": true,
            "serverSide": true,
            "ajax": {
                "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/video-moderators-addresses-list-json"
            },
            "language": {
                "url": "{{ app.datatable_lang_file }}"
            },
            "bFilter": true,
            "bPaginate": true,
            "bInfo":     true,
            {% if attribute(app, 'dropdownAttribute') is defined %}
            {{ main_macro.get_datatable_column(app['dropdownAttribute']) }}
            {% endif %}
            "aoColumnDefs": [ 
                { className: "action-menu", "targets": [ -1 ] },
                { "targets": [ -1 ], "orderable": false},
                { "searchable": false, "targets": [ -1, -2, -3 ] }
            ]
        }).prev('.dataTables_processing').hide('');
    }
    function yelp() {
        $(document).ready(function () {
            LoadDataTablesScripts(TestTable1);
            
            $(document).on('click', "a.main_ajax", function (e) {
                e.stopPropagation();
                e.preventDefault();
                var _this = $(this);

                ajaxPostSend($(this).attr('href'), _this.data());

                _this.closest('div.open').removeClass('open');
                return false;
            });
        });
    }
    
    document.addEventListener("DOMContentLoaded", yelp, false);

    var manageList = function(obj){
        JSSuccessModalBox(obj);
        $('#datatable-1').DataTable().ajax.reload();
    };

    var manageListError = function(obj){
        JSErrorModalBox(obj);
    };
