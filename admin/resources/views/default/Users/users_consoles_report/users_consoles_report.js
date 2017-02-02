
        function TestTable1() {
            $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                if (typeof (json.data) == 'object' && json.data.length >0) {
                    var date;
                    for (var i in json.data) {
                        var status = json.data[i].status;
                        var mac = json.data[i].mac;
                        var id = json.data[i].id;
                        json.data[i].mac = '<a href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/edit-users?id='+ id +'" >'+ mac +'</a>';
                        json.data[i].status = (status != 0 ? "<span class=''>{{ 'off'|trans }}</span>" : "<span class=''>{{ 'on'|trans }}</span>");
                        date = json.data[i]['last_change_status'];
                        if (date > 0) {
                            date = new Date(date * 1000);
                            json.data[i]['last_change_status'] = date.toLocaleFormat("%b %d, %Y %H:%M");
                        }
                    }
                }
            }).dataTable({
                "processing": true,
                "serverSide": true,
                "dom": 'T<"clear">lfrtip',
                "oTableTools": {
                    "sSwfPath":        "plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
                    "aButtons": [
                        {
                        "sExtends": "print",
                        "bShowAll": true,
                        "sMessage": "<h3>{{ 'STB statuses report'|trans }} ({{ "now"|date("d.m.Y") }} {{ "now"|date("H:i:s") }})</h3>",
                        "sButtonText": "{{ 'Print'|trans }}"
                        }]
                },
                "ajax": {
                    "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/users-consoles-report-json",
                    "data": function (d) {
                        d.print = false;
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
                    {"searchable": false, "targets": [0, -2]},
                    {"sortable": false, "targets": [0]}
                ]
            }).prev('.dataTables_processing').hide('');
        }

        function yelp() {
            $(document).ready(function () {
                
                $('head').append('<link href="{{ app.request_context.baseUrl }}/css/dataTables.tableTools.css" type="text/css" rel="stylesheet" />');
                $(document).on('click', '.btn.DTTT_button_print', function(){
                    $("#table_container").removeClass('col-sm-offset-2');{#.parents().map(function(){$(this).css('padding-left', 0);});#}
                });

                LoadDataTablesScripts(TestTable1);
            });
        }

        document.addEventListener("DOMContentLoaded", yelp, false);
