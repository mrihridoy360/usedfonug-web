import { Checkbox, Collapse, Tree } from 'antd';
import React from 'react';
import { DownOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import FilterTree from '../Category/FilterTree';
import LocationTree from '../Category/LocationTree';
import toast from 'react-hot-toast';
import { t } from '@/utils';

const { Panel } = Collapse;

const FilterCard = ({ slug, MinMaxPrice, setMinMaxPrice, setIsFetchSingleCatItem, setCountry, setState, setCity, selectedLocationKey, setSelectedLocationKey, setIsShowBudget, DatePosted, setDatePosted }) => {

    const handleMinPrice = (e) => {
        setMinMaxPrice({ ...MinMaxPrice, min_price: e.target.value })
    }
    const handleMaxPrice = (e) => {
        setMinMaxPrice({ ...MinMaxPrice, max_price: e.target.value })
    }

    const handleApply = (e) => {
        e.preventDefault()
        if (MinMaxPrice.min_price >= MinMaxPrice.max_price) {
            toast.error(t('enterValidBudget'))
        }
        else {
            setIsFetchSingleCatItem((prev) => !prev)
            setIsShowBudget(true)
        }
    }

    const handleDatePosted = (value) => {
        if (DatePosted === value) {
            setDatePosted('');
            setIsFetchSingleCatItem((prev) => !prev)
        } else {
            setDatePosted(value);
            setIsFetchSingleCatItem((prev) => !prev)
        }
    }

    return (
        <div className="filter_card card">
            <div className="card-header">
                <span>{t('filters')}</span>
            </div>
            <div className="card-body">
                <Collapse
                    className="all_filters"
                    expandIconPosition="right"
                    expandIcon={({ isActive }) => (
                        <DownOutlined rotate={isActive ? 180 : 0} size={24} />
                    )}
                    defaultActiveKey={['1']}
                >
                    <Panel header={t("category")} key="1">
                        <FilterTree slug={slug} />
                    </Panel>
                    <Panel header={t("location")} key="2" id='loc'>
                        <LocationTree setCountry={setCountry} setState={setState} setCity={setCity} setIsFetchSingleCatItem={setIsFetchSingleCatItem} selectedLocationKey={selectedLocationKey} setSelectedLocationKey={setSelectedLocationKey} />
                    </Panel>
                    <Panel header={t("budget")} key="3">
                        <form className="budget_div" onSubmit={handleApply}>
                            <div className="max_min">
                                <input type='number' required value={MinMaxPrice?.min_price} onChange={handleMinPrice} placeholder={t('from')} />
                                <input type='number' required value={MinMaxPrice?.max_price} onChange={handleMaxPrice} placeholder={t('to')} />
                            </div>
                            <div className="apply_budget">
                                <button type='submit'>{t('apply')}</button>
                            </div>
                        </form>
                    </Panel>

                    <Panel header={t("datePosted")} key="4">
                        <div className='date_posted_checkbox'>
                            <Checkbox
                                onChange={() => handleDatePosted('all-time')}
                                checked={DatePosted === 'all-time'}
                            >
                                {t('allTime')}
                            </Checkbox>
                            <Checkbox
                                onChange={() => handleDatePosted('today')}
                                checked={DatePosted === 'today'}
                            >
                                {t('today')}
                            </Checkbox>
                            <Checkbox
                                onChange={() => handleDatePosted('within-1-week')}
                                checked={DatePosted === 'within-1-week'}
                            >
                                {t('within1Week')}
                            </Checkbox>
                            <Checkbox
                                onChange={() => handleDatePosted('within-2-week')}
                                checked={DatePosted === 'within-2-week'}
                            >
                                {t('within2Weeks')}
                            </Checkbox>
                            <Checkbox
                                onChange={() => handleDatePosted('within-1-month')}
                                checked={DatePosted === 'within-1-month'}
                            >
                                {t('within1Month')}
                            </Checkbox>
                            <Checkbox
                                onChange={() => handleDatePosted('within-3-month')}
                                checked={DatePosted === 'within-3-month'}
                            >
                                {t('within3Months')}
                            </Checkbox>
                        </div>
                    </Panel>
                </Collapse>
            </div>
        </div>
    );
};

export default FilterCard;
