// BM stands for "BookMark"

// PRD

// Bookmarking: Allow bookmark to be associated with one principal.
// Allow liking of bookmarks by any principal, and add it as a count.

// Require deduction of a bookmark (payment in ICP) to call it.
// Attribute that bookmark credit deduction to the principal of the book owner.



use candid::{CandidType, Deserialize, Encode, Decode};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable};
use std::{borrow::Cow, cell::RefCell};
use std::sync::atomic::{AtomicUsize, Ordering};

type Memory = VirtualMemory<DefaultMemoryImpl>;

const MAX_BM_SIZE: u32 = 50000;

#[derive(CandidType, Deserialize)]
pub struct BookMark {
    pub post_id: u64,
    pub user_query: String,
    pub author: String,
    pub title: String,
    pub heading: String,
    pub content: String,
    pub summary: String,
    pub bookmarked: bool,
}

static BM_COUNTER: AtomicUsize = AtomicUsize::new(1);

// Because bookmarks is a custom type, we must specify how it is stored and retrieved.
impl Storable for BookMark {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: MAX_BM_SIZE,
        is_fixed_size: false,
    };
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static BM: RefCell<StableBTreeMap<u64, BookMark, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1))),
        )
    );
}


#[ic_cdk_macros::update]
pub fn save_bm(user_query: String, author: String, title: String, heading: String, content: String, summary: String) -> u64 {
    let post_id = BM_COUNTER.fetch_add(1, Ordering::SeqCst) as u64;
    let card = BookMark {
        post_id,
        user_query,
        author,
        title,
        heading,
        content,
        summary,
        bookmarked: false,
    };

    BM.with(|cards| cards.borrow_mut().insert(post_id, card));

    post_id
}

#[ic_cdk_macros::update]
pub fn bookmark_bm(post_id: u64) {
    BM.with(|bm| {
        let mut bm = bm.borrow_mut();
        if let Some(mut c) = bm.remove(&post_id) {
            c.bookmarked = !c.bookmarked;
            bm.insert(post_id, c);
        }
    });
}

#[ic_cdk_macros::update]
pub fn delete_bm(post_id: u64) {
    BM.with(|bm| {
        let mut bm = bm.borrow_mut();
        bm.remove(&post_id);
    });
}

#[ic_cdk_macros::query]
pub fn get_bm(post_id: u64) -> Option<BookMark> { 
    BM.with(|bm| bm.borrow().get(&post_id))
}

#[ic_cdk_macros::query]
pub fn get_bms() -> Vec<Option<BookMark>> {
  BM.with(|bm| {
      bm.borrow()
          .iter()
          .filter(|(_key, card)| card.bookmarked)
          .map(|(key, _card)| get_bm(key))
          .collect()
  })
}