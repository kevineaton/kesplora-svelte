<script type="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { h, html } from "gridjs";
  import Grid from "gridjs-svelte";
  import { DateTime } from "luxon";
  import { Card, Screen } from "../../structure";
  import { UsersAPI } from "../../api/admin";
  import { translateDate, DATE_FORMAT_ISO, DATE_FORMAT_LOCALE_SHORT } from "../../utils";

  let loading = true;
  let users: any[] = [];

  const cols = [{
    id: "id",
    name: "ID",
  },{
    id: "systemRole",
    name: "Role",
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
      const display = translateDate(cell, DATE_FORMAT_ISO, DATE_FORMAT_LOCALE_SHORT);
      return html(display)
    }
  },{
    id: "lastLoginOn",
    name: "Last Login",
    formatter: (cell: any) => {
      const display = translateDate(cell, DATE_FORMAT_ISO, DATE_FORMAT_LOCALE_SHORT);
      return html(display)
    }
  },{
    id: "projectCount",
    name: "Projects",
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
      const result = await UsersAPI.getUsersOnPlatform();
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
      console.log(err);
    }finally{
      loading = false;
    }
  });

  const selectUser = (userId: number) => {
    navigate(`/admin/users/${userId}`)
  }
</script>

<Screen>
  <div class="row">
    <div class="col-12">
      <Card title="Site Users" {loading}>
        <Grid data={users} columns={cols} sort={true} />
      </Card>
    </div>
  </div>
</Screen>