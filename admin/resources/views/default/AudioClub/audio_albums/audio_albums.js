
        function TestTable1() {
            $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                if (typeof (json.data) == 'object') {
                    for (var i in json.data) {
                        var id = json.data[i].id;
                        var status = json.data[i].status;

                        json.data[i].operations = "<div class='col-xs-3 col-sm-8'>\n\
                                                        <a href='#' class='dropdown-toggle no_context_menu' data-toggle='dropdown'>\n\
                                                            <i class='pull-right fa fa-cog'></i>\n\
                                                        </a>\n\
                                                        <ul class='dropdown-menu pull-right'>\n\
                                                            <li>\n\
                                                                <a href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/edit-audio-albums?id=" + id + "'>\n\
                                                                    <span>{{ 'Edit'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/toggle-audio-albums' data-albumsid='" + id + "' data-albumsstatus='" + status + "'>\n\
                                                                    <span>" + (status != 0 ? "{{ 'Unpublish'|trans }}" : "{{ 'Publish'|trans }}") + "</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='remove-audio-albums no_context_menu'  data-albumsid='" + id + "'>\n\
                                                                    <span>{{ 'Delete'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                        </ul>\n\
                                                    </div>";
                        json.data[i].status = status != 0 ? "<span class=''>{{ 'Published'|trans }}</span>" : "<span class=''>{{ 'Unpublished'|trans }}</span>";

                        var name = json.data[i].name;

                        json.data[i].name = '<a href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/edit-audio-albums?id=' + id + '" >' + name + '</a>';
                    }
                }
            }).dataTable({
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/audio-albums-list-json"
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
                "columnDefs": [
                    { className: "action-menu", "targets": [ -1 ] },
                    {"searchable": false, "targets": [-1, -3, -2, 2]},
                    {"sortable": false, "targets": [-1, -3, 2]},
                    {"className": "data-filter-status", "targets": [-2]}
                ]
            }).prev('.dataTables_processing').hide('');
        }

        function yelp() {
            $(document).ready(function () {
                $(document).on('click', "a.main_ajax", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var _this = this;
                    var sendData = $(_this).data();
                    if ($(_this).attr("disabled")) {
                        JSErrorModalBox({msg: "{{ 'Action is not available'|trans }}! " + ($(_this).attr('warning_msg') ? $(_this).attr('warning_msg') : '')});
                    } else {
                        ajaxPostSend($(_this).attr('href'), sendData, false );
                    }
                    $(this).closest('div.open').removeClass('open');
                    return false;
                });

                $(document).on('click', "a.remove-audio-albums", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var _this = this;
                    if ($(_this).attr("disabled")) {
                        JSErrorModalBox({msg: "{{ 'Action is not available'|trans }}! " + ($(_this).attr('warning_msg') ? $(_this).attr('warning_msg') : '')});
                        return false;
                    }
                    JScloseModalBox();
                    $('#modalbox').find('.modal-header-name span').addClass('txt-danger').text('{{ 'Warning'|trans }}' + '!');
                    $('#modalbox').find('.devoops-modal-inner').html($("#modal_del_body").text());
                    $('#modalbox').find('.devoops-modal-bottom').html($("#modal_del_buttons").text());

                    $('#del_album_btn').data($(_this).data());

                    $('#modalbox').show();
                    return false;
                });

                LoadDataTablesScripts(TestTable1);
            });
        }

        document.addEventListener("DOMContentLoaded", yelp, false);

        function closeModalBox() {
            $("#modalbox").hide();
            $('#modalbox').find('.modal-header-name span').removeClass('txt-danger').empty();
            $('#modalbox').find('.devoops-modal-inner').empty();
            $('#modalbox').find('.devoops-modal-bottom').empty();
        }

/*
{# this templates moved to .twig file and left for demonstrate purpose only 

    <script type="text/template" id="modal_del_body">
        <div class="col-md-12">
            <span class="col-md-12 txt-default">{{ 'Do you really want delete this album and all compositions?'|trans }}</span>
        </div>
    </script>

    <script type="text/template" id="modal_del_buttons">
        <div class="pull-right no-padding">
            <a id="del_album_btn" type="button" class="main_ajax btn btn-danger pull-right no_context_menu" href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/remove-audio-albums'>{{ 'Delete'|trans }}</a>
            <button type="reset" id="del_album_button" class="btn btn-success pull-right">{{ 'Cancel'|trans }}</button>
        </div>
    </script>
#}*/
