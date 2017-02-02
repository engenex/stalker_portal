
        function TestTable1() {
            $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                if (typeof (json.data) == 'object' && json.data.length >0) {
                    var date;
                    for (var i in json.data) {
                        var uid = json.data[i].uid;
                        var mac = json.data[i].mac;
                        json.data[i].mac = '<a href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/{{ app.controller_alias }}?uid=' + uid + '" >' + mac + '</a>';
                        json.data[i].msg = '<div class="event_message">' + json.data[i].msg + '</div>';
                        json.data[i].sended = json.data[i].sended != '0' ? '<span class="">{{ 'Delivered'|trans }}</span>' : '<span class="">{{ 'Not delivered'|trans }}</span>';
                        json.data[i].ended = json.data[i].ended != '0' ? '<span class="">{{ 'Received'|trans }}</span>' : '<span class="">{{ 'Not received'|trans }}</span>';
                        date = json.data[i]['addtime'];
                        if (date > 0) {
                            date = new Date(date * 1000);
                            json.data[i]['addtime'] = date.toLocaleFormat("%b %d, %Y %H:%M");
                        }
                        date = json.data[i]['eventtime'];
                        if (date > 0) {
                            date = new Date(date * 1000);
                            json.data[i]['eventtime'] = date.toLocaleFormat("%b %d, %Y %H:%M");
                        }
                    }
                }
            }).dataTable({
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/events-list-json",
                    "data": function (d) {
                        d = dataTableDataPrepare(d);

                        $('input[id^="filter_"]').each(function () {
                            d['filters[' + $(this).attr("id").replace("filter_", "") + ']'] = $(this).val();
                        });
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
                "aoColumnDefs": [
                    {"searchable": false, "targets": [1, 2, 4, 6, 8, 9]}
                ]
            }).prev('.dataTables_processing').hide('');
        }

        function yelp() {
            $(document).ready(function () {
                LoadDataTablesScripts(TestTable1);

                eventsMenuHandlers();

                $(document).on('click', '#add_events', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $("#modalbox_ad").show().find('input, select, textarea').removeAttr('disabled');
                    checkFields('#s2_user_list_type', e);
                    checkFields('#s2_event', e);
                    return false;
                });

                $(document).on('click', "#clean_events", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    ajaxPostSend("{{app.request_context.baseUrl}}/{{app.controller_alias}}/clean-events", {uid: $(this).data('uid')});
                    return false;
                });

            });
        }
        
        document.addEventListener("DOMContentLoaded", yelp, false);
