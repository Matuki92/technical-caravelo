<script setup lang="ts">
import useSubscriberState from '@/state/useSubscriberState';
import {
  Ref,
  ref,
  onMounted,
  computed,
  watch,
} from 'vue';
import Loader from '@/components/Loader/Loader.vue';
import Button from '@/components/Button/Button.vue';
import Modal from '@/components/Modal/Modal.vue';
import { Subscriber } from '@/declarations/types';
import { incrementMotives, decrementMotives, minQuota, maxQuota } from '@/config/subscribers';

const {
  subscribers,
  loadingSubscribers,
  getSubscribers,
  setSubscriberQuota,
  loadingSetSubscriberQuota,
} = useSubscriberState();

const showEditQuotaModal = ref(false);
const error = ref(false);
const success = ref(false);
const selectedMotive: Ref<string> = ref('');

/*
  selectedSubscriber: contains the data that is initially displayed in the modal
  selectedSubscriberDirty: will hold all the changes made during the interactions
  in order to validate and compare with the initial values before saving.
*/
const selectedSubscriber: Ref<Subscriber | null> = ref(null);
const selectedSubscriberDirty: Ref<Subscriber | null> = ref(null);

/*
  Hold a motive list to show in the dropdown for each use case
  default (untouched, disabled), incremented and subtracted quota.
*/
const motiveList = computed(() => {
  const { quota: defaultQuota } = selectedSubscriber.value || {};
  const { quota: dirtyQuota } = selectedSubscriberDirty.value || {};

  if (typeof defaultQuota === 'number' && typeof dirtyQuota === 'number') {
    if (dirtyQuota < defaultQuota) {
      return decrementMotives;
    }
    
    if (dirtyQuota > defaultQuota) {
      return incrementMotives;
    }
  }

  return [];
});

function handleEditQuota(subscriber: Subscriber) {
  selectedSubscriber.value = { ...subscriber };
  selectedSubscriberDirty.value = { ...subscriber };
  showEditQuotaModal.value = true;
}

/*
   Set motive back to its default value, this will avoid visual bugs
   when modifying the quota value after an option was previously
   selected in the dropdown.
*/
function validateSelectedMotive() {
  if (!motiveList.value.length) {
    selectedMotive.value = '';
  }
}

function decrementSubscriberQuota() {
  if (!selectedSubscriberDirty.value) return;
  selectedSubscriberDirty.value.quota = Math.max(minQuota, selectedSubscriberDirty.value.quota - 1);
  validateSelectedMotive();
}

function incrementSubscriberQuota() {
  if (!selectedSubscriberDirty.value) return;
  selectedSubscriberDirty.value.quota = Math.min(maxQuota, selectedSubscriberDirty.value.quota + 1);
  validateSelectedMotive();
}

function resetValues() {
  error.value = false;
  success.value = false;
  selectedMotive.value = '';
  selectedSubscriber.value = null;
  selectedSubscriberDirty.value = null;
}

async function handleSaveChanges() {
  if (!selectedSubscriberDirty.value) return;

  error.value = false;
  success.value = false;

  try {
    await setSubscriberQuota(selectedSubscriberDirty.value.id, {
      quota: selectedSubscriberDirty.value.quota,
      motive: selectedMotive.value,
    });

    selectedSubscriber.value = { ...selectedSubscriberDirty.value }
    selectedMotive.value = '';
    success.value = true;
  } catch {
    error.value = true;
  }
}

watch(showEditQuotaModal, () => {
  if (showEditQuotaModal.value === false) {
    resetValues();
  }
});

onMounted(getSubscribers);
</script>

<template>
  <div class="flex items-center justify-center w-full h-full">
    <Loader v-if="loadingSubscribers" />

    <div
      class="p-8 rounded-lg shadow"
      data-testid="manage-subscribers"
      v-else
    >
      <span class="title">Manage subscribers</span>

      <ul class="mt-8">
        <li
          class="flex items-center justify-between py-4"
          v-for="subscriber in subscribers"
          :aria-label="subscriber.name"
        >
          <div class="text-xl font-medium">
            {{ subscriber.name }}
          </div>

          <Button
            @click="handleEditQuota(subscriber)"
          >
            Edit quota
          </Button>
        </li>
      </ul>
    </div>
  </div>

  <Modal
    v-if="selectedSubscriberDirty"
    v-model="showEditQuotaModal"
  >
    <template #title>
      Edit flights
    </template>

    <template #>
      <div>
        <div class="text-neutral-600">Add or remove flights from the subscriber</div>

        <div class="flex items-center justify-between mt-10">
          <div class="font-medium">Flights left</div>

          <div class="flex items-center gap-4">
            <Button
              :disabled="loadingSetSubscriberQuota || selectedSubscriberDirty.quota === minQuota"
              size="sm"
              @click="decrementSubscriberQuota"
            >
              &lt;
            </Button>

            <section aria-label="quota">
              {{ selectedSubscriberDirty.quota }}
            </section>

            <Button
              :disabled="loadingSetSubscriberQuota || selectedSubscriberDirty.quota === maxQuota"
              size="sm"
              @click="incrementSubscriberQuota"
            >
              &gt;
            </Button>
          </div>
        </div>
        <hr class="my-6">
        <div class="flex flex-col items-center gap-2 mt-4 md:gap-8 md:flex-row justfy-between">
          <div class="font-medium">Please select a motive*</div>

          <select
            :disabled="loadingSetSubscriberQuota || !motiveList.length"
            v-model="selectedMotive"
            class="w-[16rem] border rounded-lg focus:outline-none p-2 truncate"
          >
            <option disabled value="">Select</option>

            <option
              v-for="motive in motiveList"
              :value="motive.value"
            >
              {{ motive.label }}
            </option>

            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div class="flex flex-row-reverse w-full mt-10">
        <Button
          :disabled="loadingSetSubscriberQuota || !selectedMotive"
          @click="handleSaveChanges"
        >
          {{ loadingSetSubscriberQuota ? 'Saving...' : 'Save' }}
        </Button>
      </div>

      <section
        v-if="error"
        class="p-2 mt-4 text-red-600 border border-red-600 rounded-lg bg-red-100/50"
        aria-label="error-message"
      >
        An error occured!
      </section>

      <section
        v-else-if="success"
        class="p-2 mt-4 text-green-600 border border-green-600 rounded-lg bg-green-100/50"
        aria-label="success-message"
      >
        Changes saved successfully!
      </section>
    </template>
  </Modal>
</template>