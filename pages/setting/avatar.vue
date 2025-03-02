<template>
  <div>
    <div class="mb-4">
      <UFormGroup
        label="Current avatar"
        class="w-full"
        help="This would be blank by default"
      >
        <UAvatar :src="url" size="3xl" />
      </UFormGroup>
    </div>

    <div class="mb-4">
      <UFormGroup
        label="New avatar"
        class="w-full"
        name="avatar"
        help="After choosing an image click Save to actually upload the new avatar"
      >
        <UInput id="fileInput" type="file" @change="fileChanged" />
      </UFormGroup>
    </div>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="uploading"
      :disabled="uploading"
      @click="saveAvatar"
    />
  </div>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { toastSuccess, toastError } = useAppToast();
const { url } = useAvatarUrl();
const uploading = ref(false);
const fileInput = ref();

const fileChanged = (fl: FileList) => {
  fileInput.value = fl[0];
};
const saveAvatar = async () => {
  if (!fileInput.value) {
    toastError("Select a file to upload");
    return;
  }
  const fileExt = fileInput.value.name.split(".").pop();
  // const fileName = `test_${user.value?.id}.${fileExt}`
  const fileName = `${Math.round(Math.random() * 10000000)}.${fileExt}`;

  try {
    uploading.value = true;
    const currentAvatar = user.value?.user_metadata.avatar;
    // if(currentAvatar === fileName) {
    //   const { error } = await supabase.storage.from('avatar')
    //       .update(fileName, fileInput.value)
    //   if (error) throw error
    // } else {
    //   const { error } = await supabase.storage.from('avatar')
    //       .upload(fileName, fileInput.value)
    //   if (error) throw error
    // }
    // }

    const { error } = await supabase.storage
      .from("avatar")
      .upload(fileName, fileInput.value);
    if (error) throw error;

    await supabase.auth.updateUser({
      data: {
        avatar: fileName,
      },
    });

    fileInput.value = null;

    if (currentAvatar) {
      const { error } = await supabase.storage
        .from("avatar")
        .remove([currentAvatar]);
      if (error) {
        throw error;
      }
    }

    toastSuccess("Avatar uploaded");
  } catch (error) {
    toastError("Error uploading avatar", error);
  } finally {
    uploading.value = false;
  }
};
</script>
