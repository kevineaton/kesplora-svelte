<script type="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { h, html } from "gridjs";
  import Grid from "gridjs-svelte";
  import { DateTime } from "luxon";
  import { UsersAPI } from "../../api/admin";
  import { Card, Screen } from "../../structure";
  import { translateStatus } from "../../utils";

  export let projectId: number = 0;

  let loading = true;
  let users: any[] = [];

  const cols = [{
    id: "id",
    name: "ID",
  },{
    id: "firstName",
    name: "First",
  },{
    id: "lastName",
    name: "Last",
  },{
    id: "participantCode",
    name: "Code",
  },{
    id: "email",
    name: "Email",
  },{
    id: "dateOfBirth",
    name: "DOB",
  },{
    id: "createdOn",
    name: "Signed Up",
    formatter: (cell: any) => {
      const display = DateTime.fromISO(cell).toLocaleString();
      return html(display)
    }
  },{
    id: "lastLoginOn",
    name: "Last Login",
    formatter: (cell: any) => {
      const display = DateTime.fromISO(cell).toLocaleString();
      return html(display)
    }
  },{
    id: "projectStatus",
    name: "Status",
    formatter: (cell: any) => {
      const display = translateStatus(cell);
      return html(`<span class="text-status text-status-${cell}>${display}</span>"`);
    }
  },{
    id: "actionId",
    name: "",
    formatter: (cell: any) => {
      return [
        h("i", {
          "class": "text-primary bi bi-eye icon-table",
          "onClick": () => {
            selectUser(cell);
          }
        })
      ]
    }
  },];
  
  onMount(async () => {
    loading = true;
    try{
      const result = await UsersAPI.getProjectUsers(projectId);
      const userList: any[] = [];
      for(const u of result.body.data){
        u.actionId = u.id;
        if(!u.projectCount) {
          u.projectCount = 0; // admins won't have this field
        }
        if(u.participantCode !== ""){
          u.firstName = "--";
          u.lastName = "--";
          u.email = "--";
        }
        if(u.dateOfBirth === "1970-01-01"){
          u.dateOfBirth = "Unknown";
        } else {
          u.dateOfBith = DateTime.fromISO(u.dateOfBirth).toLocaleString()
        }
        userList.push(u);
      }
      users = userList;
    }catch(err){

    }finally{
      loading = false;
    }
  });


  const selectUser = (userId: number) => {
    navigate(`/admin/users/${userId}/projects/${projectId}`)
  }
</script>

<Screen>
  <div class="row">
    <div class="col-12">
      <Card title="Project Users" {loading}>
        <Grid data={users} columns={cols} sort={true} />
      </Card>
    </div>
  </div>
</Screen>