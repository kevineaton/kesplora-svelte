<script lang="ts">
  import { Card, Screen } from "../structure/index";

  let shortName = "";
  let name = "";
  let description = "";
  let domain = "";
  let status = "";
  let code = "";
  let title = "";
  let firstName = "";
  let lastName = "";
  let email = "";
  let technicalContact = "";
</script>

<Screen ignoreAuth>
  <div class="row">
    <div class="col-8">
      <Card title="Site Configuration">
      </Card>
    </div>
    <div class="col-4">
      <Card title="User Information">
      </Card>
    </div>
  </div>
</Screen>